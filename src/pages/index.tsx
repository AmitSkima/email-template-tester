import { useState } from "react";
import { Inter } from "next/font/google";

import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import Editor, { loader } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useLocalStorage } from "usehooks-ts";

const DEFAULT_PORT = 3000;

import { useElementSize } from "@/hooks/useElementSize";
import { MailRequestBody, MailResponse } from "@/pages/api/sendmail";
import { toast } from "@/components/ui/use-toast";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormiKInputFieldProps } from "@/types/formik";

const inter = Inter({ subsets: ["latin"] });

loader.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs",
  },
});

const editorOptions = {
  formatOnPaste: true,
  formatOnType: true,
  minimap: {
    enabled: false,
  },
};

const emailValdationSchema = Yup.object({
  mailTo: Yup.string().email("Invalid email").required("Mail:to required"),
});

export default function Home() {
  const [htmlContent, setHtmlContent] = useState("");
  const [mailTo, setMailTo] = useLocalStorage("mail:to", "");

  const [isSendingMail, setIsSendingMail] = useState(false);

  const [containerRef, containerSize] = useElementSize();

  const submitMail = async () => {
    setIsSendingMail(true);
    const body: MailRequestBody = {
      toEmail: mailTo,
      name: "Amit Chauhan",
      subject: "Email template testing",
      html: htmlContent,
    };
    try {
      const response: MailResponse = await fetch(
        `http://localhost:${process.env.PORT ?? DEFAULT_PORT}/api/sendmail`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          method: "POST",
          body: JSON.stringify(body),
        }
      ).then((res) => res.json());
      toast({
        variant: response.status === 200 ? "default" : "destructive",
        title: response.message,
        duration: 2000,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to send mail",
        duration: 2000,
      });
    }
    setIsSendingMail(false);
  };

  return (
    <main className={`dark h-screen ${inter.className}`}>
      <Head>
        <title>Mail template tester</title>
      </Head>
      <div className="flex flex-col h-screen">
        <div className="flex justify-between p-2 items-center">
          <h1 className="text-xl font-bold">Mail Tester</h1>
          <Formik
            initialValues={{
              mailTo,
            }}
            validationSchema={emailValdationSchema}
            onSubmit={submitMail}
            enableReinitialize
            validateOnChange
          >
            {({ isValid, setValues }) => (
              <Form className="flex flex-row items-center gap-2">
                <Field name="mailTo">
                  {({ meta, field }: FormiKInputFieldProps<string>) => (
                    <Input
                      value={mailTo}
                      onChange={(e) => {
                        setMailTo(e.target.value);
                        setValues({ mailTo: e.target.value });
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      placeholder="Mail:to"
                      className={cn(
                        "w-60",
                        Boolean(meta.touched && meta.error)
                          ? "!border-red-500 focus:!border-red-500"
                          : ""
                      )}
                    />
                  )}
                </Field>
                <Button
                  type="submit"
                  onClick={submitMail}
                  disabled={!isValid || isSendingMail}
                >
                  Send mail
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        <div ref={containerRef} className="h-screen">
          <ResizablePanelGroup
            direction="horizontal"
            className="border h-full"
            style={{ height: containerSize.height }}
          >
            <ResizablePanel defaultSize={50}>
              <Editor
                className="border"
                language="html"
                height={containerSize.height}
                theme="vs-dark"
                value={htmlContent}
                options={editorOptions}
                onChange={(contents) => setHtmlContent(contents ?? "")}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              {htmlContent === "" ? (
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">No Preview</span>
                </div>
              ) : (
                <div className="h-full">
                  <iframe className="h-full w-full" srcDoc={htmlContent} />
                </div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </main>
  );
}
