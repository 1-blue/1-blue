import { InterstitialAd, AdEventType, TestIds } from "react-native-google-mobile-ads";

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : "ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz";

export const showInterstitialAd = async (): Promise<void> => {
  const interstitial = InterstitialAd.createForAdRequest(adUnitId);

  await new Promise<void>((resolve) => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show();
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      resolve();
    });

    interstitial.load();
  });
};
