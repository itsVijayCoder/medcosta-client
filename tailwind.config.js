/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
export default {
   darkMode: ["class"],
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            primary: {
               DEFAULT: "hsl(var(--primary))",
               foreground: "hsl(var(--primary-foreground))",
            },
            secondary: {
               DEFAULT: "hsl(var(--secondary))",
               foreground: "hsl(var(--secondary-foreground))",
            },
            destructive: {
               DEFAULT: "hsl(var(--destructive))",
               foreground: "hsl(var(--destructive-foreground))",
            },
            muted: {
               DEFAULT: "hsl(var(--muted))",
               foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
               DEFAULT: "hsl(var(--accent))",
               foreground: "hsl(var(--accent-foreground))",
            },
            popover: {
               DEFAULT: "hsl(var(--popover))",
               foreground: "hsl(var(--popover-foreground))",
            },
            card: {
               DEFAULT: "hsl(var(--card))",
               foreground: "hsl(var(--card-foreground))",
            },
            chart: {
               1: "hsl(var(--chart-1))",
               2: "hsl(var(--chart-2))",
               3: "hsl(var(--chart-3))",
               4: "hsl(var(--chart-4))",
               5: "hsl(var(--chart-5))",
            },
            sidebar: {
               DEFAULT: "hsl(var(--sidebar-background))",
               foreground: "hsl(var(--sidebar-foreground))",
               primary: "hsl(var(--sidebar-primary))",
               "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
               accent: "hsl(var(--sidebar-accent))",
               "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
               border: "hsl(var(--sidebar-border))",
               ring: "hsl(var(--sidebar-ring))",
               "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
               "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
            },
         },
         borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
         },
         boxShadow: {
            "glow-blue": "0 0 20px rgba(59, 130, 246, 0.15)",
            "glow-purple": "0 0 20px rgba(147, 51, 234, 0.15)",
            sidebar: "4px 0 20px rgba(0, 0, 0, 0.1)",
            "menu-active":
               "0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(59, 130, 246, 0.2)",
         },
      },
   },
   plugins: [
      plugin(function ({ addBase, theme }) {
         addBase({
            h1: { fontSize: theme("fontSize.2xl") },
            h2: { fontSize: theme("fontSize.xl") },
            h3: { fontSize: theme("fontSize.lg") },
         });
      }),
      require("tailwindcss-animate"),
   ],
};
