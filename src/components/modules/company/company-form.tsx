"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateCompany } from "@/hooks";
import { updateCompanySchema } from "@/validation/company.validation";

export default function CompanyForm({
  companyName,
  canEdit,
}: {
  companyName: string;
  canEdit: boolean;
}) {
  const { mutate: save, isPending } = useUpdateCompany();

  const form = useForm({
    defaultValues: { companyName },
    validators: { onChange: updateCompanySchema },
    onSubmit: ({ value }) => {
      const next = value.companyName.trim();
      save(
        { companyName: next },
        { onSuccess: () => form.reset({ companyName: next }) },
      );
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company</CardTitle>
        <CardDescription>
          {canEdit
            ? "The name your candidates see on invitations."
            : "Only the company owner can change these details."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-4">
            <form.Field name="companyName">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Company name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      disabled={!canEdit}
                      value={canEdit ? field.state.value : companyName}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {canEdit && (
              <form.Subscribe selector={(state) => state.values.companyName}>
                {(value) => (
                  <Button
                    type="submit"
                    className="self-start"
                    disabled={isPending || value.trim() === companyName}
                  >
                    {isPending ? (
                      <>
                        <Spinner />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                )}
              </form.Subscribe>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
