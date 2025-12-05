"use client";
import { generateForm } from "@/actions/forms/generate-form";
import { MAX_FREE_FORMS } from "@/lib/utils";
import { Lock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type InitialState = {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
};

const initialState: InitialState = {
  success: false,
  message: "",
};

type Props = {
  text?: string;
  totalForms?: number;
  isSubscribed?: boolean;
};

const GenerateFormInput: React.FC<Props> = ({
  text,
  totalForms,
  isSubscribed,
}) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    generateForm,
    initialState,
  );

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast(state.message);
        router.push("/forms");
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  return (
    <form
      action={formAction}
      className="w-full flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3"
    >
      <div className="flex-1 relative">
        <Input
          type="text"
          name="description"
          defaultValue={text}
          placeholder="Write a prompt to generate form..."
          required
          className="h-14 px-6 text-base border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm"
        />
      </div>

      {isSubscribed || totalForms! < MAX_FREE_FORMS ? (
        <Button
          disabled={isPending}
          className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          type="submit"
        >
          {isPending ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate
            </>
          )}
        </Button>
      ) : (
        <Button
          disabled
          className="h-14 px-8 rounded-xl font-semibold"
          variant="outline"
        >
          <Lock className="w-5 h-5 mr-2" />
          Upgrade Plan
        </Button>
      )}
    </form>
  );
};

export default GenerateFormInput;
