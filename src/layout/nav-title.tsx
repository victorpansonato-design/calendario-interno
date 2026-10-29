import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import { ChevronRight } from "lucide-react";

interface Crumb {
   label: string;
   to?: string;
   mono?: boolean;
}

interface RouteEntry {
   match: RegExp;
   build: (params: Record<string, string>) => Crumb[];
}

/**
 * Mapa de breadcrumbs por rota. Adicione novas entradas conforme o sistema cresce.
 * O fallback usa o último segmento da URL como rótulo.
 */
const ROUTES: RouteEntry[] = [
   {
      match: /^\/dashboard$/,
      build: () => [{ label: "Painel" }],
   },
];

function titleizeSegment(segment: string): string {
   const text = decodeURIComponent(segment).replace(/[-_]/g, " ");
   return text.charAt(0).toUpperCase() + text.slice(1);
}

export function NavTitle() {
   const { pathname } = useLocation();

   const entry = ROUTES.find(r => r.match.test(pathname));
   const segments = pathname.split("/").filter(Boolean);
   const crumbs: Crumb[] =
      entry?.build({}) ?? (segments.length ? segments.map(s => ({ label: titleizeSegment(s) })) : [{ label: "Sistema" }]);

   return (
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center">
         <ol className="flex items-center gap-1.5 truncate text-sm">
            {crumbs.map((c, i) => {
               const last = i === crumbs.length - 1;
               const node =
                  c.to && !last ? (
                     <Link
                        to={c.to}
                        className={
                           "rounded-sm px-1 transition-colors hover:text-foreground " +
                           (c.mono ? "font-mono tabular text-muted-foreground" : "text-muted-foreground")
                        }
                     >
                        {c.label}
                     </Link>
                  ) : (
                     <span
                        className={(last ? "font-medium text-foreground" : "text-muted-foreground") + (c.mono ? " font-mono tabular" : "")}
                     >
                        {c.label}
                     </span>
                  );

               return (
                  <Fragment key={`${c.label}-${i}`}>
                     <li className="flex items-center truncate">{node}</li>
                     {!last ? (
                        <li aria-hidden className="text-muted-foreground/60">
                           <ChevronRight className="h-3.5 w-3.5" />
                        </li>
                     ) : null}
                  </Fragment>
               );
            })}
         </ol>
      </nav>
   );
}
