import type { CvEntry } from "@/lib/cv";
import {
  TypographyH4,
  TypographySmall,
} from "@/components/ui/typography";

function TimelineItem({ entry }: { entry: CvEntry }) {
  return (
    <li className="relative ps-8">
      <span
        aria-hidden="true"
        className="absolute top-1.5 -left-[5.5px] size-3 rounded-full border-2 border-foreground bg-background"
      />
      <TypographySmall className="text-muted-foreground">
        {entry.dates}
      </TypographySmall>
      <TypographyH4 className="mt-2">{entry.title}</TypographyH4>
      <p className="mt-1 text-sm font-medium">
        {entry.org}
        <span className="font-normal text-muted-foreground">
          {" "}
          · {entry.place}
        </span>
      </p>
      <ul className="mt-3 space-y-1.5 text-sm leading-6 text-muted-foreground">
        {entry.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </li>
  );
}

export function CvTimeline({
  entries,
  label,
}: {
  entries: CvEntry[];
  label: string;
}) {
  return (
    <ol
      aria-label={label}
      className="relative space-y-10 border-s border-border ms-1.5"
    >
      {entries.map((entry) => (
        <TimelineItem key={`${entry.org}-${entry.dates}`} entry={entry} />
      ))}
    </ol>
  );
}
