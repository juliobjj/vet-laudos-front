import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";

export default function Config() {
  return (
    <div className="p-8">
      <PageHeader
        title="Pets"
        description="Gerencie os pets cadastrados no sistema."
        actions={
          <Button className="ml-auto bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition px-4 py-2">
            <Plus className="w-4 h-4 mr-2" /> Novo Pet
          </Button>
        }
      />
    </div>
  );
}
