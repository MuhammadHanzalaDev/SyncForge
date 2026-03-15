"use client";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FormProvider, UseFormReturn, FieldValues } from "react-hook-form";
import CustomButton from "../form/CustomButtom";

interface FormDialogProps<T extends FieldValues> {
  children: React.ReactNode;
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: T) => void | Promise<void>;
  form: UseFormReturn<T>;
  submitBtnText?: string;
  isCancelBtn?: boolean;
  cancelBtnText?: string;
}

function FormDialog<T extends FieldValues>({
  children,
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  form,
  submitBtnText = "Submit",
  isCancelBtn = true,
  cancelBtnText = "Cancel",
}: FormDialogProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>

              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>

            <div className="py-3">{children}</div>

            <DialogFooter className="mt-3">
              {isCancelBtn && (
                <DialogClose asChild>
                  <CustomButton variant="outline">{cancelBtnText}</CustomButton>
                </DialogClose>
              )}

              <CustomButton type="submit">{submitBtnText}</CustomButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;
