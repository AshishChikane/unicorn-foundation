import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Bridge = () => {
  const location = useLocation();

  useEffect(() => {
    const container = document.getElementById("debridgeWidget");
    if (container) container.innerHTML = ""; // Clear previous widget

    const existingScript = document.getElementById("debridge-widget-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "debridge-widget-script";
      script.src = "https://app.debridge.finance/assets/scripts/widget.js";
      script.async = true;
      script.onload = () => initWidget();
      document.body.appendChild(script);
    } else {
      initWidget(); // If script is already loaded, re-init widget
    }

    async function initWidget() {
      if (!window.deBridge?.widget) {
        console.error("deBridge.widget is not available after script load");
        return;
      }

      const widget = await window.deBridge.widget({
        element: "debridgeWidget",
        v: "1",
        mode: "deswap",
        title: "Bridge",
        width: 600,
        height: 800,
        inputChain: 43114,
        outputChain: 56,
        lang: "en",
        r: "32264",
        affiliateFeePercent: "0.5",
        affiliateFeeRecipient: "0x9757Fea8F165441d1a61AA80092F73A37286a2e2",
        supportedChains: {
          inputChains: {
            "1": "all", "10": "all", "56": "all", "100": "all", "137": "all", "146": "all",
            "388": "all", "747": "all", "998": "all", "999": "all", "1088": "all", "1329": "all",
            "1514": "all", "2741": "all", "4158": "all", "5000": "all", "8453": "all", "32769": "all",
            "42161": "all", "43114": "all", "50104": "all", "59144": "all", "60808": "all", "80094": "all",
            "98866": "all", "7565164": "all", "245022934": "all"
          },
          outputChains: {
            "1": "all", "10": "all", "56": "all", "100": "all", "137": "all", "146": "all",
            "388": "all", "747": "all", "998": "all", "999": "all", "1088": "all", "1329": "all",
            "1514": "all", "2741": "all", "4158": "all", "5000": "all", "8453": "all", "32769": "all",
            "42161": "all", "43114": "all", "50104": "all", "59144": "all", "60808": "all", "80094": "all",
            "98866": "all", "7565164": "all", "245022934": "all"
          }
        },
        inputCurrency: "",
        outputCurrency: "",
        address: "",
        showSwapTransfer: true,
        amount: "",
        outputAmount: "",
        isAmountFromNotModifiable: false,
        isAmountToNotModifiable: false,
        styles: btoa(
          JSON.stringify({
            borderRadius: 12,
            controlBorderRadius: 6,
            primary: "#ff6c00",
            secondary: "#a06600",
            primaryBtnBg: "#fea603",
            primaryBtnBgHover: "#e99607",
            primaryBtnText: "#000000",
            secondaryBtnBg: "#1f2c49",
            btnFontSize: 16,
            btnFontWeight: 500,
            descriptionFontSize: "16",
          })
        ),
        theme: "dark",
        disabledWallets: [],
        disabledElements: [],
      });

      widget.on("needConnect", () => {
        console.log("User needs to connect wallet");
      });

      widget.on("order", (_, event) => {
        console.log("Order placed", event);
      });
    }
  }, [location.pathname]);

  return (
    // <div className="min-h-screen pt-20 pb-8">
    //   <div className="container mx-auto px-4 max-w-6xl">

    //   </div>
    // </div>
    <div className="pt-20">
      <div className="flex items-center justify-center px-4 py-8 min-h-screen">
        <div id="debridgeWidget" className="mx-auto" />
      </div>
    </div>
  );
};

export default Bridge;