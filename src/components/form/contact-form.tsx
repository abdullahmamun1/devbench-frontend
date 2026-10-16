"use client";

import { useForm } from "@tanstack/react-form";
import { CircleCheck } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useContact } from "@/hooks";
import { focusFirstInvalid } from "@/utils/form";
import { contactSchema } from "@/validation/contact.validation";

export default function ContactForm() {
  const { mutate: send, isPending } = useContact();
  const formRef = useRef<HTMLFormElement>(null);
  // Name of the person who just sent a message, to thank them by name
  const [sentBy, setSentBy] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    validators: { onChange: contactSchema },
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
    onSubmit: ({ value }) =>
      send(value, {
        onSuccess: () => {
          setSentBy(value.name.trim().split(" ")[0] || "there");
          form.reset();
        },
      }),
  });

  if (sentBy) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-4 py-10 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-brand-2/15 text-brand-2">
          <CircleCheck className="size-8" />
        </span>
        <h2 className="font-heading text-2xl font-semibold">
          Thanks, {sentBy}. Your message is on its way.
        </h2>
        <p className="max-w-sm text-muted-foreground">
          We&apos;ll reply to the email address you gave us.
        </p>
        <Button variant="outline" onClick={() => setSentBy(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Your name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    autoComplete="name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    autoComplete="off"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="subject">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Subject</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="message">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={6}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {field.state.value.length}/2000
                </p>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" variant="brand" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Sending...
            </>
          ) : (
            "Send message"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
