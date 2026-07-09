"use client";

import * as React from "react";
import { Award, Download, Printer, Eye, Calendar, Hash, Trophy } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppStore } from "@/store/app";
import { useLang, useT, pickLang } from "@/components/meso/localized";
import { useEnsureLearner } from "@/components/meso/use-ensure-learner";
import { UI, t as translate } from "@/lib/i18n";
import type { LangCode, CertificateView } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/format";

export function CertificateSection() {
  const lang = useLang() as LangCode;
  const t = useT();
  const learnerId = useEnsureLearner();
  const qc = useQueryClient();
  const lastCertCode = useAppStore((s) => s.lastCertCode);
  const setLastCertCode = useAppStore((s) => s.setLastCertCode);

  const certsQ = useQuery<CertificateView[]>({
    queryKey: ["certificates", learnerId],
    queryFn: async () => {
      const res = await fetch(`/api/certificates?learnerId=${encodeURIComponent(learnerId)}`);
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      return data.certificates;
    },
  });

  const [previewCode, setPreviewCode] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (lastCertCode) {
      setPreviewCode(lastCertCode);
      setLastCertCode(null);
      qc.invalidateQueries({ queryKey: ["certificates", learnerId] });
      toast.success(translate(UI.certificate.congrats, lang));
    }
  }, [lastCertCode, lang, qc, setLastCertCode, learnerId]);

  const download = async (code: string) => {
    try {
      const res = await fetch(`/api/certificate?code=${code}&lang=${lang}`);
      const svg = await res.text();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certifikata-${code}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Shkarkimi dështoi.");
    }
  };

  const print = (code: string) => {
    setPreviewCode(code);
    setTimeout(() => window.print(), 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-brand-muted text-2xl"><Award className="size-6 text-brand" /></div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{translate(UI.certificate.title, lang)}</h1>
          <p className="text-muted-foreground">{translate(UI.certificate.subtitle, lang)}</p>
        </div>
      </div>

      {certsQ.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      ) : (certsQ.data ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-muted text-3xl">🏆</div>
          <p className="mt-3 max-w-sm mx-auto text-muted-foreground">{translate(UI.certificate.none, lang)}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(certsQ.data ?? []).map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
              <div className="relative aspect-[1.414/1] bg-gradient-to-br from-brand-muted/40 to-card">
                <img
                  src={`/api/certificate?code=${c.code}&lang=${lang}`}
                  alt={`Certifikata ${c.code}`}
                  className="size-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border/60 p-4">
                <div className="min-w-0">
                  <div className="truncate font-bold">{t(c.lessonTitle)}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Hash className="size-3" /> {c.code}</span>
                    <span className="flex items-center gap-1"><Trophy className="size-3 text-brand" /> {c.score}%</span>
                    <span className="flex items-center gap-1"><Calendar className="size-3" /> {formatDate(c.issuedAt, lang)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setPreviewCode(c.code)} aria-label="Preview"><Eye className="size-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => print(c.code)} aria-label="Print"><Printer className="size-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => download(c.code)} aria-label="Download"><Download className="size-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview dialog */}
      <Dialog open={!!previewCode} onOpenChange={(o) => !o && setPreviewCode(null)}>
        <DialogContent className="no-print max-w-4xl border-border/60 p-0 sm:rounded-2xl">
          <DialogTitle className="sr-only">Certifikata</DialogTitle>
          <DialogDescription className="sr-only">Pamja e certifikatës</DialogDescription>
          {previewCode && (
            <div className="printable-certificate">
              <img
                src={`/api/certificate?code=${previewCode}&lang=${lang}`}
                alt="Certifikata"
                className="size-full object-contain"
              />
            </div>
          )}
          <div className="no-print flex justify-center gap-2 border-t border-border/60 p-3">
            <Button size="sm" variant="outline" className="gap-2" onClick={() => previewCode && print(previewCode)}>
              <Printer className="size-4" /> Printo
            </Button>
            <Button size="sm" className="gap-2" onClick={() => previewCode && download(previewCode)}>
              <Download className="size-4" /> Shkarko
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
