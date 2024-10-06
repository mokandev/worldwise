import { useSearchParams } from "react-router-dom";

type useUrlPositionHookType = [string, string]

export function useUrlPosition(): useUrlPositionHookType {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat') as string;
	const lng = searchParams.get('lng') as string;


return [lat, lng]
}
