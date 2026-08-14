import { Alert, Linking } from 'react-native';

/** Безопасно открыть внешний URL (tel:/http:/maps). На симуляторе tel: часто недоступен. */
export async function openExternalUrl(url: string, unavailableMessage?: string) {
  try {
    const can = await Linking.canOpenURL(url);
    if (!can) {
      if (unavailableMessage) Alert.alert('', unavailableMessage);
      return false;
    }
    await Linking.openURL(url);
    return true;
  } catch {
    if (unavailableMessage) Alert.alert('', unavailableMessage);
    return false;
  }
}
