import { Spinner } from "@/shared/ui/spinner";

function CustomLoader() {
  return (
    <div className="flex items-center gap-6">
      <Spinner className="size-8" />
    </div>
  );
}

export default CustomLoader;
