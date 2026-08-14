import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

/** Открыть страницу сайта (in-app browser, fallback — системный). */
export async function openWebPage(url: string) {
  try {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: '#04492d',
    });
  } catch {
    await Linking.openURL(url).catch(() => {});
  }
}
