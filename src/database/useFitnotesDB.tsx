import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { DataSource, EntityManager, MoreThan } from "typeorm";
import { Exercise, defaults as EXERCISE_DEFAULTS } from "./models/Exercise";
import { TrainingLog } from "./models/TrainingLog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category, defaults as CATEGORY_DEFAULTS } from "./models/Category";
import { toCommonDate } from "../helpers";
import { AddExerciseUnits1673724314261 } from "./migrations/1673724314261-AddExerciseUnits";
import { AddDefaultExerciseUnit1673808666919 } from "./migrations/1673808666919-AddDefaultExerciseUnit";

interface IFitnotesDBContext {
  manager?: EntityManager;
  exercises: Exercise[];
  categories: Category[];
  currLogs: TrainingLog[];
  selectedDate: Date;
  log: (exercise: Exercise, weight: number, reps: number) => void;
  deleteLog: (log: TrainingLog) => void;
  updateLog: (log: TrainingLog, weight: number, reps: number) => void;
  setDate: (date: Date) => void;
  getExerciseLogs: (exercise: Exercise) => Promise<TrainingLog[]>;
  addExercise: (
    name: string,
    category: Category
  ) => Promise<Exercise | undefined>;
  addCategory: (name: string, color: string) => Promise<Category | undefined>;
  clearDB: () => void;
  update: () => void;
}

export const FitnotesDBContext = createContext<IFitnotesDBContext>({
  exercises: [],
  categories: [],
  currLogs: [],
  selectedDate: new Date(),
  log: (exercise: Exercise, weight: number, reps: number) => {},
  deleteLog: (log: TrainingLog) => {},
  updateLog: (log: TrainingLog, weight: number, reps: number) => {},
  setDate: (date: Date) => {},
  getExerciseLogs: async (exercise: Exercise) => [],
  addExercise: async (name: string, category: Category) => undefined,
  addCategory: async (name: string, color: string) => undefined,
  clearDB: () => {},
  update: () => {},
});

export const FitnotesDBProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [manager, setManager] = useState<EntityManager>();

  useEffect(() => {
    const dataSource = new DataSource({
      database: "fitnotes",
      driver: require("expo-sqlite"),
      entities: [TrainingLog, Exercise, Category],
      migrationsRun: true,
      migrations: [
        AddExerciseUnits1673724314261,
        AddDefaultExerciseUnit1673808666919,
      ],
      synchronize: false,
      type: "expo",
    });
    dataSource.initialize().then((source) => {
      setManager(source.manager);
    });
  }, []);

  const initDefaults = async () => {
    if (!manager) return;

    const isInit = await AsyncStorage.getItem("defaultsInitialised");
    if (isInit === null || isInit === "false") {
      console.log("Setting defaults.");

      manager.clear(TrainingLog);
      manager.clear(Category);
      manager.clear(Exercise);

      await Promise.all(
        CATEGORY_DEFAULTS.map((category) => {
          const _category = new Category(category.name, category.colour);
          _category._id = category.id;
          return manager.save(_category);
        })
      );

      await Promise.all(
        EXERCISE_DEFAULTS.map(async (exercise) => {
          const category = await manager.findOne(Category, {
            where: { name: exercise.category_name },
          });

          if (!category) {
            console.warn(
              "Could not find category for exercise ",
              exercise.name
            );
            return;
          }

          const _exercise = new Exercise(exercise.name, category);

          return manager.save(_exercise);
        })
      );

      AsyncStorage.setItem("defaultsInitialised", "true");

      update();
    }
  };

  useEffect(() => {
    if (!manager) return;
    initDefaults();
    update();
  }, [manager]);

  const update = () => {
    if (!manager) return;
    manager.find(Category).then(setCategories);
    manager.find(Exercise).then(setExercises);
    manager
      .find(TrainingLog, {
        where: { date: toCommonDate(selectedDate) },
      })
      .then(setCurrLogs);
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (!manager) return;
  }, [manager]);

  const addExercise = async (
    name: string,
    category: Category
  ): Promise<Exercise | undefined> => {
    if (!manager) return;
    const existingName = await manager.findOne(Exercise, {
      where: { name: name },
    });
    if (existingName) {
      return;
    }
    const newExercise = manager.create(Exercise, { name, category });
    const res = await manager.insert(Exercise, newExercise);
    update();
    if (!res) {
      return undefined;
    } else {
      return (
        (await manager.findOne(Exercise, {
          where: { name: newExercise.name },
        })) ?? undefined
      );
    }
  };

  const updateExercise = async (
    exercise: Exercise,
    name: string,
    category: Category
  ): Promise<boolean> => {
    if (!manager) return false;
    return false;
  };

  const getExerciseLogs = async (
    exercise: Exercise
  ): Promise<TrainingLog[]> => {
    if (!manager) return [];
    return await manager.find(TrainingLog, {
      where: { exercise: { _id: exercise._id } },
    });
  };

  const clearDB = async () => {
    if (!manager) return;
    console.log("Clearning DB");
    await manager.clear(TrainingLog);
    await manager.clear(Exercise);
    await manager.clear(Category);
    await AsyncStorage.setItem("defaultsInitialised", "false");
    initDefaults();
  };

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [currLogs, setCurrLogs] = useState<TrainingLog[]>([]);

  useEffect(update, [selectedDate]);

  const log = async (exercise: Exercise, weight: number, reps: number) => {
    if (!manager) return;
    const _log = manager.create(TrainingLog, {
      date: toCommonDate(selectedDate),
      exercise: manager.create(Exercise, { _id: exercise._id }),
      metric_weight: weight,
      reps: reps,
    });

    manager.insert(TrainingLog, _log).then(async () => {
      await recalculatePBs(_log.exercise);
      update();
    });
  };

  const updateLog = async (log: TrainingLog, weight: number, reps: number) => {
    if (!manager) return;
    const updatedLog = await manager.save(TrainingLog, {
      ...log,
      metric_weight: weight,
      reps,
    });

    await recalculatePBs(updatedLog.exercise);
    update();
  };

  const recalculatePBs = async (exercise: Exercise) => {
    if (!manager) return;

    const logs = await manager
      .createQueryBuilder(TrainingLog, "log")
      .select()
      .where({ exercise: { _id: exercise._id } })
      .getMany();

    const maxMap = new Map<number, TrainingLog>();
    logs.forEach((log) => {
      const repMaxLog = maxMap.get(log.reps);

      if (maxMap.size === 0) {
        maxMap.set(log.reps, log);
      }

      if (repMaxLog !== undefined) {
        if (
          log.metric_weight > repMaxLog.metric_weight ||
          (log.metric_weight === repMaxLog.metric_weight &&
            log._id < repMaxLog._id)
        ) {
          log.is_personal_record = true;
          repMaxLog.is_personal_record = false;
          maxMap.set(log.reps, log);
        }
      } else {
        log.is_personal_record = true;
        Array.from(maxMap.keys())
          .sort()
          .reverse()
          .forEach((rep) => {
            const maxLogForRep = maxMap.get(rep);
            if (!maxLogForRep) return;
            if (
              rep > log.reps &&
              maxLogForRep.metric_weight >= log.metric_weight
            ) {
              // Not a PB unless all PB logs that are higher reps have lower weights
              log.is_personal_record = false;
            } else if (
              rep < log.reps &&
              maxLogForRep.metric_weight <= log.metric_weight
            ) {
              // If a pb with fewer reps and lower weight found, it's not a PB
              maxLogForRep.is_personal_record = false;
              maxMap.delete(rep);
            }
          });
        if (log.is_personal_record) {
          maxMap.set(log.reps, log);
        }
      }
    });

    await manager.save(logs);
  };

  const deleteLog = async (log: TrainingLog) => {
    if (!manager) return;
    await manager.delete(TrainingLog, { _id: log._id });
    await recalculatePBs(log.exercise);
    update();
  };

  const addCategory = async (
    name: string,
    color: string
  ): Promise<Category | undefined> => {
    if (!manager) return;
    const existingName = await manager.findOne(Category, {
      where: { name: name },
    });
    if (existingName) {
      return;
    }
    const newCategory = manager.create(Category, { name, colour: color });
    const res = await manager.insert(Category, newCategory);
    update();
    if (!res) {
      return undefined;
    } else {
      return (
        (await manager.findOne(Category, {
          where: { name: newCategory.name },
        })) ?? undefined
      );
    }
  };

  return (
    <FitnotesDBContext.Provider
      value={{
        manager,
        exercises,
        categories,
        selectedDate,
        currLogs,
        log,
        deleteLog,
        updateLog,
        setDate: setSelectedDate,
        getExerciseLogs,
        addExercise,
        addCategory,
        clearDB,
        update,
      }}
    >
      {children}
    </FitnotesDBContext.Provider>
  );
};

export const useFitnotesDB = (): IFitnotesDBContext => {
  const context = useContext(FitnotesDBContext);
  return context;
};
