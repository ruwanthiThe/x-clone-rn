import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function SsoCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(tabs)"); // or "/" if you don’t use tabs
  }, []);

  return null;
}
