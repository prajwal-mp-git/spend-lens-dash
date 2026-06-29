import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Plus,
  Sparkles,
  TrendingUp,
  Wallet,
  Trophy,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spendlens — Multi-currency expense intelligence" },
      {
        name: "description",
        content:
          "Spendlens turns multi-currency expenses into a single, clear USD view with live what-if scenarios.",
      },
      { property: "og:title", content: "Spendlens" },
      { property: "og:description", content: "Multi-currency expense intelligence." },
    ],
  }),
  component: Spendlens,
});

const initialRates: Record<string, number> = {
  USD: 1.0, EUR: 0.9201, GBP: 0.7887, INR: 83.47, JPY: 153.82,
  AUD: 1.5312, CAD: 1.3641, SGD: 1.3478, AED: 3.6725, MXN: 17.154,
};

type Expense = {
  id: number;
  date: string;
  merchant: string;
  amount: number;
  currency: string;
  category: string;
};

const initialExpenses: Expense[] = [
  { id: 1, date: "2026-02-03", merchant: "Indigo Airlines", amount: 8200, currency: "INR", category: "Travel" },
  { id: 2, date: "2026-02-10", merchant: "Slack Pro", amount: 12.5, currency: "USD", category: "Software" },
  { id: 3, date: "2026-02-14", merchant: "Dishoom London", amount: 68.4, currency: "GBP", category: "Food" },
  { id: 4, date: "2026-02-19", merchant: "AWS", amount: 143.0, currency: "USD", category: "Software" },
  { id: 5, date: "2026-02-25", merchant: "Singapore Taxi", amount: 32.0, currency: "SGD", category: "Travel" },
  { id: 6, date: "2026-03-02", merchant: "Figma", amount: 15.0, currency: "USD", category: "Software" },
  { id: 7, date: "2026-03-07", merchant: "Boulangerie Utopie", amount: 9.8, currency: "EUR", category: "Food" },
  { id: 8, date: "2026-03-11", merchant: "JR Rail Pass", amount: 50000, currency: "JPY", category: "Travel" },
  { id: 9, date: "2026-03-15", merchant: "Netflix", amount: 15.49, currency: "USD", category: "Entertainment" },
  { id: 10, date: "2026-03-20", merchant: "Swiggy", amount: 620, currency: "INR", category: "Food" },
  { id: 11, date: "2026-03-28", merchant: "Air Canada", amount: 410.0, currency: "CAD", category: "Travel" },
  { id: 12, date: "2026-04-02", merchant: "GitHub Copilot", amount: 10.0, currency: "USD", category: "Software" },
  { id: 13, date: "2026-04-08", merchant: "Burj Khalifa tickets", amount: 149.0, currency: "AED", category: "Entertainment" },
  { id: 14, date: "2026-04-12", merchant: "Qantas", amount: 520.0, currency: "AUD", category: "Travel" },
  { id: 15, date: "2026-04-15", merchant: "Linear", amount: 8.0, currency: "USD", category: "Software" },
  { id: 16, date: "2026-04-18", merchant: "Tacos el Califa", amount: 180, currency: "MXN", category: "Food" },
  { id: 17, date: "2026-04-22", merchant: "Spotify", amount: 10.99, currency: "USD", category: "Entertainment" },
  { id: 18, date: "2026-04-25", merchant: "Zoom", amount: 15.99, currency: "USD", category: "Software" },
  { id: 19, date: "2026-04-29", merchant: "Lune Croissanterie", amount: 22.0, currency: "AUD", category: "Food" },
  { id: 20, date: "2026-05-01", merchant: "Emirates flight", amount: 1850, currency: "AED", category: "Travel" },
];

const CATEGORIES = ["Travel", "Food", "Software", "Entertainment"] as const;
const CATEGORY_COLORS: Record<string, string> = {
  Travel: "var(--color-chart-1)",
  Food: "var(--color-chart-2)",
  Software: "var(--color-chart-5)",
  Entertainment: "var(--color-chart-3)",
};

const fmtUSD = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Spendlens() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [eurRate, setEurRate] = useState(initialRates.EUR);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<{ key: "date" | "usd"; dir: "asc" | "desc" }>({
    key: "date",
    dir: "desc",
  });

  // form
  const [fMerchant, setFMerchant] = useState("");
  const [fAmount, setFAmount] = useState("");
  const [fCurrency, setFCurrency] = useState("USD");
  const [fCategory, setFCategory] = useState("Travel");
  const [fDate, setFDate] = useState("");

  const rates = useMemo(() => ({ ...initialRates, EUR: eurRate }), [eurRate]);
  const baseRates = initialRates;

  const toUSD = (amount: number, currency: string, r = rates) =>
    Math.round((amount / r[currency]) * 100) / 100;

  const enriched = useMemo(
    () => expenses.map((e) => ({ ...e, usd: toUSD(e.amount, e.currency) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expenses, eurRate],
  );

  const totalUSD = useMemo(
    () => enriched.reduce((s, e) => s + e.usd, 0),
    [enriched],
  );
  const baseTotalUSD = useMemo(
    () =>
      expenses.reduce(
        (s, e) => s + Math.round((e.amount / baseRates[e.currency]) * 100) / 100,
        0,
      ),
    [expenses],
  );
  const impact = totalUSD - baseTotalUSD;

  const topMerchants = useMemo(() => {
    const m = new Map<string, number>();
    enriched.forEach((e) => m.set(e.merchant, (m.get(e.merchant) ?? 0) + e.usd));
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([merchant, total]) => ({ merchant, total }));
  }, [enriched]);

  const categoryRows = useMemo(() => {
    const map = new Map<
      string,
      { category: string; count: number; total: number; largest: { merchant: string; usd: number } }
    >();
    enriched.forEach((e) => {
      const row = map.get(e.category) ?? {
        category: e.category,
        count: 0,
        total: 0,
        largest: { merchant: e.merchant, usd: e.usd },
      };
      row.count += 1;
      row.total += e.usd;
      if (e.usd > row.largest.usd) row.largest = { merchant: e.merchant, usd: e.usd };
      map.set(e.category, row);
    });
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [enriched]);

  const chartData = categoryRows.map((r) => ({
    category: r.category,
    total: Math.round(r.total * 100) / 100,
  }));

  const filtered = useMemo(
    () => (activeCategory === "All" ? enriched : enriched.filter((e) => e.category === activeCategory)),
    [enriched, activeCategory],
  );

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = sortBy.key === "date" ? a.date : a.usd;
      const bv = sortBy.key === "date" ? b.date : b.usd;
      if (av < bv) return sortBy.dir === "asc" ? -1 : 1;
      if (av > bv) return sortBy.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy]);

  const toggleSort = (key: "date" | "usd") =>
    setSortBy((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const amountNum = Number(fAmount);
  const formValid =
    fMerchant.trim() && fAmount !== "" && !Number.isNaN(amountNum) && amountNum > 0 && fCurrency && fCategory && fDate;
  const showLargeWarn = amountNum > 1_000_000;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    setExpenses((prev) => [
      ...prev,
      {
        id: (prev.at(-1)?.id ?? 0) + 1,
        date: fDate,
        merchant: fMerchant.trim(),
        amount: amountNum,
        currency: fCurrency,
        category: fCategory,
      },
    ]);
    setFMerchant("");
    setFAmount("");
    setFDate("");
  };

  const SortIcon = ({ k }: { k: "date" | "usd" }) =>
    sortBy.key !== k ? (
      <ArrowUpDown className="size-3.5 opacity-50" />
    ) : sortBy.dir === "asc" ? (
      <ArrowUp className="size-3.5" />
    ) : (
      <ArrowDown className="size-3.5" />
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Spendlens</h1>
              <p className="text-xs text-muted-foreground">Multi-currency expense intelligence</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <span className="size-1.5 rounded-full bg-success" /> Live in-memory ledger
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Top row: KPIs + What-if */}
        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary to-[oklch(0.32_0.16_280)] p-6 text-primary-foreground shadow-sm lg:col-span-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary-foreground/70">
              <Wallet className="size-4" /> Overall total spend
            </div>
            <div className="mt-3 text-4xl font-semibold tracking-tight">{fmtUSD(totalUSD)}</div>
            <div className="mt-1 text-sm text-primary-foreground/70">
              {enriched.length} transactions across {new Set(enriched.map((e) => e.currency)).size} currencies
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Trophy className="size-4" /> Top 3 merchants (USD)
            </div>
            <ol className="mt-3 space-y-2.5">
              {topMerchants.map((m, i) => (
                <li key={m.merchant} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-6 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{m.merchant}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{fmtUSD(m.total)}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="size-4" /> What-if: EUR/USD
              </div>
              <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">
                {eurRate.toFixed(4)}
              </span>
            </div>
            <input
              type="range"
              min={0.8}
              max={1.1}
              step={0.0001}
              value={eurRate}
              onChange={(e) => setEurRate(Number(e.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[color:var(--color-primary)]"
            />
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>0.80</span>
              <span>Base 0.9201</span>
              <span>1.10</span>
            </div>
            <p className="mt-3 text-sm">
              Impact vs Base Rate:{" "}
              <span
                className={
                  "font-semibold tabular-nums " +
                  (impact > 0 ? "text-destructive" : impact < 0 ? "text-success" : "text-muted-foreground")
                }
              >
                {impact >= 0 ? "+" : "-"}${Math.abs(impact).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </p>
          </div>
        </section>

        {/* Category table + chart */}
        <section className="grid gap-5 lg:grid-cols-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Category breakdown</h2>
              <span className="text-xs text-muted-foreground">Ranked by USD total</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Category</th>
                    <th className="px-4 py-2.5 text-right font-medium">Txns</th>
                    <th className="px-4 py-2.5 text-right font-medium">Total USD</th>
                    <th className="px-4 py-2.5 text-left font-medium">Largest single</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryRows.map((r) => (
                    <tr key={r.category} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ background: CATEGORY_COLORS[r.category] }}
                          />
                          <span className="font-medium">{r.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{r.count}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">{fmtUSD(r.total)}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="text-foreground">{r.largest.merchant}</span>{" "}
                        <span className="tabular-nums">· {fmtUSD(r.largest.usd)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-base font-semibold">Spend by category</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "var(--color-accent)", opacity: 0.4 }}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [fmtUSD(v), "USD"]}
                  />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                    {chartData.map((d) => (
                      <Cell key={d.category} fill={CATEGORY_COLORS[d.category]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Filters + table */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Transactions</h2>
            <div className="flex flex-wrap gap-2">
              {(["All", ...CATEGORIES] as const).map((c) => {
                const active = activeCategory === c;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition " +
                      (active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-accent")
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">
                    <button onClick={() => toggleSort("date")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                      Date <SortIcon k="date" />
                    </button>
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium">Merchant</th>
                  <th className="px-4 py-2.5 text-left font-medium">Category</th>
                  <th className="px-4 py-2.5 text-right font-medium">Original</th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    <button onClick={() => toggleSort("usd")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                      USD <SortIcon k="usd" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((e) => (
                  <tr key={e.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">{e.date}</td>
                    <td className="px-4 py-3 font-medium">{e.merchant}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 text-xs">
                        <span className="size-1.5 rounded-full" style={{ background: CATEGORY_COLORS[e.category] }} />
                        {e.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {e.amount.toLocaleString()} {e.currency}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{fmtUSD(e.usd)}</td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No transactions in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add form */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="size-4 text-primary" />
            <h2 className="text-base font-semibold">Add expense</h2>
          </div>
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-6">
            <Field label="Merchant" className="md:col-span-2">
              <input
                value={fMerchant}
                onChange={(e) => setFMerchant(e.target.value)}
                placeholder="e.g. Notion"
                className="input"
              />
            </Field>
            <Field label="Amount">
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={fAmount}
                onChange={(e) => setFAmount(e.target.value)}
                placeholder="0.00"
                className="input"
              />
              {showLargeWarn && (
                <p className="mt-1 text-xs text-destructive">⚠ That's a large amount — please double-check.</p>
              )}
              {fAmount !== "" && amountNum <= 0 && (
                <p className="mt-1 text-xs text-destructive">Amount must be greater than 0.</p>
              )}
            </Field>
            <Field label="Currency">
              <select value={fCurrency} onChange={(e) => setFCurrency(e.target.value)} className="input">
                {Object.keys(initialRates).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Category">
              <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className="input">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} className="input" />
            </Field>
            <div className="md:col-span-6 flex justify-end">
              <button
                type="submit"
                disabled={!formValid}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="size-4" /> Add expense
              </button>
            </div>
          </form>
        </section>
      </main>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={"block " + className}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
