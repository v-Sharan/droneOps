import { InitialLayout } from "@/components";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { ThemeProvider } from "@/providers/ThemeContextProvider";

export default function RootLayout() {

  return (
    <ClerkAndConvexProvider>
      <ThemeProvider duration={350}>
        <InitialLayout />
      </ThemeProvider>
    </ClerkAndConvexProvider>
  );
}
