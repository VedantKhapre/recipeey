import { AppSidebar } from "@/components/app-sidebar";
import { ChatInterface } from "@/components/ai/chat-interface";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const topicMap: Record<string, { category: string; title: string }> = {
  "getting-started": {
    category: "Getting Started",
    title: "Getting Started",
  },
  "building-your-application": {
    category: "Building Your Application",
    title: "Data Fetching",
  },
  "api-reference": {
    category: "API Reference",
    title: "API Reference",
  },
  architecture: {
    category: "Architecture",
    title: "Architecture",
  },
};

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = topicMap[id] || {
    category: "New Chat",
    title: "Chat",
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">{topic.category}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{topic.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col p-4 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ChatInterface showHeader={true} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
