import Image from "next/image";

type FunctionCardProps = {
  source: string;
  title: string;
  description: string;
  alt: string;
};

export default function FunctionCard({
  source,
  title,
  description,
  alt,
}: FunctionCardProps) {
  return (
    <div
      className="group flex min-h-36 w-full items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100">
        <Image
          src={source}
          alt={alt}
          width={26}
          height={26}
        />
      </div>

      <div className="min-w-0">
        <h3 className="mb-2 text-sm font-semibold leading-snug text-slate-800">
          {title}
        </h3>

        <p className="mb-0 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}