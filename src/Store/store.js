import { configureStore } from "@reduxjs/toolkit";
import telegramLoginSLice from "./Slices/telegramLoginSLice";
import homePageSlice from "./Slices/homePageSlice";
import boostsSlice from "./Slices/boostsSlice";
import taskSlice from "./Slices/taskSlice";
import userRefferalSlice from "./Slices/userRefferalsSlice"

export const store = configureStore({
  reducer: {
    telegramLogin: telegramLoginSLice,
    homePage: homePageSlice,
    boosts: boostsSlice,
    tasks: taskSlice,
    refferals: userRefferalSlice,
  }
});
