import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useTelegramBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.BackButton) return;

    if (location.pathname !== "/") {
      tg.BackButton.show();

      const handleBack = () => {
        navigate("/");
      };

      tg.BackButton.onClick(handleBack);
      return () => tg.BackButton.offClick(handleBack);
    } else {
      tg.BackButton.hide();
    }
  }, [location, navigate]);
};

export const useKeyboardVisible = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const threshold = 150; // you can adjust this
    const initialHeight = window.innerHeight;

    const onResize = () => {
      const heightDiff = initialHeight - window.innerHeight;
      setKeyboardVisible(heightDiff > threshold);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return keyboardVisible;
};

function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatLargeNumber(num) {
  if (num < 1000) {
    return num.toString(); // no letter
  } else if (num < 1_000_000) {
    return `${addCommas(num)} K`;
  } else if (num < 1_000_000_000) {
    const millions = Math.floor(num / 1000);
    return `${addCommas(millions)} M`;
  } else {
    const billions = Math.floor(num / 1000);
    return `${addCommas(billions)} B`;
  }
}

/**
 * Форматирует большие числа с использованием сокращений K, M, B.
 * @param {number} num - Число для форматирования.
 * @returns {string} - Отформатированная строка (например, "12.999 B").
 */
export function formatLargeNumberForBalance(num) {
  const format = (n, suffix) => {
    return `${Math.floor(n)} ${suffix}`;
  };

  if (num < 1_000_000) {
    return num;
  } else if (num < 1_000_000_000) {
    return format(num / 1_000_000, "M");
  } else {
    return format(num / 1_000_000_000, "B");
  }
}
