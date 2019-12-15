import { useState } from 'react';

export default function useLastLoad({
  setParams,
  params,
  lastUpdate,
}: {
  setParams: Function;
  params: any;
  lastUpdate?: Date;
}) {
  const [lastLoad, setLastLoad] = useState(new Date());
  const hasUpdated = lastUpdate && lastUpdate > lastLoad;

  if (hasUpdated) {
    setParams(params);
    setLastLoad(new Date());
  }
}
