import { useEffect, useState } from "react";
import { fetchData } from "services/api";

export function useDataSource<T>(name: string): [T[], boolean, Error | null] {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData<T>(name + ".json")
      .then(setData)
      .catch(setError)
      .finally(() => {
        setIsLoading(false);
      });
  }, [name]);

  return [data, isLoading, error];
}
