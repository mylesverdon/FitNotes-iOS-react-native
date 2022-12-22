import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DataSource, EntityManager, Repository } from "typeorm";
import { Exercise } from "./models/Exercise";
import { TrainingLog } from "./models/TrainingLog";

interface IFitnotesDBContext {
  refresh: () => void;
  getAllLogs: () => Promise<TrainingLog[]>;
  exerciseList: Exercise[];
  addExercise: (log: TrainingLog) => void;
}

const dataSource = new DataSource({
  database: "fitnotes",
  driver: require("expo-sqlite"),
  entities: [TrainingLog],
  synchronize: true,
  type: "expo",
  // logging: true,
});

export const FitnotesDBContext = createContext<IFitnotesDBContext | null>(null);

export const FitnotesDBProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [manager, setManager] = useState<EntityManager>();

  useEffect(() => {
    dataSource.initialize().then((source) => setManager(source.manager));
  }, []);

  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  useEffect(() => {
    if (!manager) return;
    const exercises = manager.find(Exercise);
  }, [manager]);

  const getAllLogs = async (): Promise<TrainingLog[]> => {
    if (!manager) return [];
    return await manager.find(TrainingLog, { where: { date: "2022-01-01" } });
  };

  const addExercise = (log: TrainingLog) => {
    if (!manager) return;
    manager.save(log);
  };

  const refresh = () => {};

  return (
    <FitnotesDBContext.Provider
      value={{ refresh, getAllLogs, addExercise, exerciseList }}
    >
      {children}
    </FitnotesDBContext.Provider>
  );
};

export const useFitnotesDB = (): IFitnotesDBContext | null => {
  const context = useContext(FitnotesDBContext);
  return context;
};
