"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="text-center space-y-8 px-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            AI-Powered Recipe Assistant
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            Turn Your Ingredients
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Into Delicious Recipes
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400">
          Your AI cooking companion that transforms whatever ingredients you
          have into personalized recipes. Just like ChatGPT, but exclusively for
          cooking!
        </p>

        <Button
          size="lg"
          className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-base px-8 h-12"
          asChild
        >
          <a href="/dashboard">Start Cooking</a>
        </Button>
      </div>
    </div>
  );
}
