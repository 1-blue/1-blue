import { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import RNWebView from "react-native-webview";
import Constants from "expo-constants";
import { showInterstitialAd } from "@/src/_components/AdMobBridge";

type WebViewProps = {
  source: { uri: string };
  style: { flex: number };
  onNavigationStateChange: (event: { url: string }) => void;
};

const WebView = RNWebView as unknown as (props: WebViewProps) => JSX.Element;

const getWebViewUrl = (): string => {
  const extra = Constants.expoConfig?.extra as { webViewUrl?: string } | undefined;

  if (__DEV__) {
    return Platform.OS === "android"
      ? "http://10.0.2.2:{{WEB_PORT}}"
      : "http://localhost:{{WEB_PORT}}";
  }

  return extra?.webViewUrl ?? "https://web-{{SLUG}}.vercel.app";
};

export const WebViewShell = () => {
  const uri = useMemo(() => getWebViewUrl(), []);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri }}
        style={styles.webview}
        onNavigationStateChange={(event) => {
          if (event.url.includes("/result")) {
            void showInterstitialAd();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
