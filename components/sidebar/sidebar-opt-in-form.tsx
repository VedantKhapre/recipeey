import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SidebarOptInForm() {
  return (
    <Card className="gap-2 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">Upgrade to Pro</CardTitle>
        <CardDescription>
          Get unlimited recipes, advanced AI-powered suggestions, meal planning,
          and nutrition tracking. Start cooking smarter today!
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <Button
          className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
          size="sm"
        >
          View Plans
        </Button>
      </CardContent>
    </Card>
  );
}
