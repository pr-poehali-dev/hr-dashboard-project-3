import Icon from "@/components/ui/icon";

const headcountData = [
  { month: "Янв", value: 362 },
  { month: "Фев", value: 360 },
  { month: "Мар", value: 358 },
  { month: "Апр", value: 365 },
  { month: "Май", value: 369 },
  { month: "Июн", value: 363 },
  { month: "Июл", value: 355 },
  { month: "Авг", value: 351 },
  { month: "Сен", value: 348 },
  { month: "Окт", value: 352 },
  { month: "Ноя", value: 349 },
  { month: "Дек", value: 350 },
];

const turnoverData = [
  { month: "Янв", value: 4.1 },
  { month: "Фев", value: 3.8 },
  { month: "Мар", value: 5.2 },
  { month: "Апр", value: 4.6 },
  { month: "Май", value: 6.1 },
  { month: "Июн", value: 5.8 },
  { month: "Июл", value: 7.2 },
  { month: "Авг", value: 7.9 },
  { month: "Сен", value: 8.5 },
  { month: "Окт", value: 8.2 },
  { month: "Ноя", value: 8.0 },
  { month: "Дек", value: 8.2 },
];

const departments = [
  { name: "HR", value: 100, color: "hsl(142, 71%, 38%)" },
  { name: "Продажи", value: 94, color: "hsl(217, 91%, 42%)" },
  { name: "Операции", value: 91, color: "hsl(217, 91%, 42%)" },
  { name: "Разработка", value: 78, color: "hsl(38, 92%, 48%)" },
];

const forecasts = [
  {
    label: "Прогноз текучести",
    value: "9.4%",
    delta: "+1.2% к текущему",
    bad: true,
    desc: "Тенденция роста сохраняется. Рекомендуется ревизия компенсаций.",
    icon: "TrendingUp",
  },
  {
    label: "Потребность в персонале",
    value: "+18 чел",
    delta: "до плана 380",
    bad: false,
    desc: "Приоритет — закрыть Разработку (9 чел) и Продажи (5 чел).",
    icon: "Users",
  },
  {
    label: "Время закрытия вакансий",
    value: "31 день",
    delta: "−3 дня",
    bad: false,
    desc: "Прогнозируется улучшение за счёт оптимизации воронки подбора.",
    icon: "Clock",
  },
];

function LineChart({
  data,
  color,
  normLine,
  minY,
  maxY,
  formatY,
}: {
  data: { month: string; value: number }[];
  color: string;
  normLine?: number;
  minY: number;
  maxY: number;
  formatY?: (v: number) => string;
}) {
  const W = 520;
  const H = 130;
  const padL = 42;
  const padR = 14;
  const padT = 12;
  const padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const xStep = chartW / (data.length - 1);
  const yScale = (v: number) =>
    padT + chartH - ((v - minY) / (maxY - minY)) * chartH;

  const pts = data.map((d, i) => `${padL + i * xStep},${yScale(d.value)}`);
  const polyline = pts.join(" ");
  const areaPath = `M${padL},${H - padB} L${pts.join(" L")} L${padL + (data.length - 1) * xStep},${H - padB} Z`;
  const gradId = `grad-${color.replace(/[^a-z0-9]/gi, "")}`;

  const yTicks = [minY, Math.round((minY + maxY) / 2), maxY];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {yTicks.map((t) => (
        <g key={t}>
          <line
            x1={padL}
            x2={W - padR}
            y1={yScale(t)}
            y2={yScale(t)}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
          <text
            x={padL - 6}
            y={yScale(t) + 4}
            textAnchor="end"
            fontSize={9}
            fill="#8896a8"
            fontFamily="IBM Plex Mono"
          >
            {formatY ? formatY(t) : t}
          </text>
        </g>
      ))}
      {normLine !== undefined && (
        <>
          <line
            x1={padL}
            x2={W - padR}
            y1={yScale(normLine)}
            y2={yScale(normLine)}
            stroke="hsl(0, 84%, 55%)"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            opacity={0.7}
          />
          <text
            x={W - padR - 2}
            y={yScale(normLine) - 4}
            textAnchor="end"
            fontSize={8}
            fill="hsl(0, 84%, 55%)"
            fontFamily="IBM Plex Sans"
          >
            норма {formatY ? formatY(normLine) : normLine}
          </text>
        </>
      )}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={padL + i * xStep}
          cy={yScale(d.value)}
          r={i === data.length - 1 ? 4 : 2.5}
          fill={i === data.length - 1 ? color : "white"}
          stroke={color}
          strokeWidth={1.5}
        />
      ))}
      {data.map((d, i) => (
        <text
          key={i}
          x={padL + i * xStep}
          y={H - padB + 14}
          textAnchor="middle"
          fontSize={9}
          fill="#8896a8"
          fontFamily="IBM Plex Sans"
        >
          {d.month}
        </text>
      ))}
    </svg>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header
        className="border-b px-8 py-4"
        style={{
          background: "hsl(var(--hr-surface))",
          borderColor: "hsl(var(--hr-border))",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "hsl(var(--hr-blue))" }}
            >
              <Icon name="BarChart3" size={16} className="text-white" />
            </div>
            <div>
              <h1
                className="text-base leading-tight"
                style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
              >
                HR Аналитика
              </h1>
              <p
                className="text-xs"
                style={{ color: "hsl(var(--hr-muted))" }}
              >
                Q1 2026 · 350 сотрудников
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "hsl(var(--hr-muted))" }}
          >
            <Icon name="RefreshCw" size={12} />
            <span>Обновлено сегодня, 09:41</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* KPI section label */}
        <section>
          <h2
            className="text-xs uppercase tracking-widest mb-4"
            style={{ fontWeight: 600, color: "hsl(var(--hr-muted))" }}
          >
            Ключевые показатели
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Численность */}
            <div
              className="rounded-xl p-5 space-y-3 border"
              style={{
                background: "hsl(var(--hr-surface))",
                borderColor: "hsl(var(--hr-border))",
              }}
            >
              <div className="flex items-start justify-between">
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{ fontWeight: 500, color: "hsl(var(--hr-muted))" }}
                >
                  Численность
                </p>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(var(--hr-blue-light))" }}
                >
                  <Icon
                    name="Users"
                    size={14}
                    style={{ color: "hsl(var(--hr-blue))" }}
                  />
                </div>
              </div>
              <div>
                <span
                  className="text-3xl tracking-tight"
                  style={{ fontWeight: 700, color: "hsl(var(--hr-blue))" }}
                >
                  350
                </span>
                <span
                  className="text-sm ml-1"
                  style={{ color: "hsl(var(--hr-muted))" }}
                >
                  чел
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "#e8edf3" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(350 / 380) * 100}%`,
                      background: "hsl(var(--hr-blue))",
                    }}
                  />
                </div>
                <span
                  className="text-xs whitespace-nowrap"
                  style={{ color: "hsl(var(--hr-muted))" }}
                >
                  план 380
                </span>
              </div>
              <p className="text-xs" style={{ color: "hsl(var(--hr-muted))" }}>
                Укомплектовано на{" "}
                <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
                  92,1%
                </span>
              </p>
            </div>

            {/* Текучесть — красная */}
            <div
              className="rounded-xl p-5 space-y-3 border"
              style={{
                background: "hsl(var(--hr-red-light))",
                borderColor: "hsl(0 70% 88%)",
              }}
            >
              <div className="flex items-start justify-between">
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{ fontWeight: 500, color: "hsl(0, 55%, 42%)" }}
                >
                  Текучесть · Q1
                </p>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(0, 84%, 90%)" }}
                >
                  <Icon
                    name="TrendingUp"
                    size={14}
                    style={{ color: "hsl(var(--hr-red))" }}
                  />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span
                  className="text-3xl tracking-tight"
                  style={{ fontWeight: 700, color: "hsl(var(--hr-red))" }}
                >
                  8,2%
                </span>
                <div
                  className="flex items-center gap-1 mb-1 px-2 py-0.5 rounded-full text-xs"
                  style={{
                    fontWeight: 600,
                    background: "hsl(var(--hr-red))",
                    color: "white",
                  }}
                >
                  <Icon name="ArrowUp" size={10} />
                  +3,2%
                </div>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "hsl(0, 60%, 88%)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((8.2 / 10) * 100, 100)}%`,
                    background: "hsl(var(--hr-red))",
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: "hsl(0, 55%, 42%)" }}>
                Норма{" "}
                <span style={{ fontWeight: 600, color: "hsl(var(--hr-red))" }}>
                  5%
                </span>{" "}
                — превышена на{" "}
                <span style={{ fontWeight: 600, color: "hsl(var(--hr-red))" }}>
                  3,2 п.п.
                </span>
              </p>
            </div>

            {/* Вакансии */}
            <div
              className="rounded-xl p-5 space-y-3 border"
              style={{
                background: "hsl(var(--hr-surface))",
                borderColor: "hsl(var(--hr-border))",
              }}
            >
              <div className="flex items-start justify-between">
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{ fontWeight: 500, color: "hsl(var(--hr-muted))" }}
                >
                  Вакансии
                </p>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(var(--hr-amber-light))" }}
                >
                  <Icon
                    name="Briefcase"
                    size={14}
                    style={{ color: "hsl(var(--hr-amber))" }}
                  />
                </div>
              </div>
              <div>
                <span
                  className="text-3xl tracking-tight"
                  style={{ fontWeight: 700, color: "hsl(var(--hr-amber))" }}
                >
                  23
                </span>
                <span
                  className="text-sm ml-1"
                  style={{ color: "hsl(var(--hr-muted))" }}
                >
                  открытых
                </span>
              </div>
              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                  style={{
                    fontWeight: 600,
                    background: "hsl(var(--hr-red-light))",
                    color: "hsl(var(--hr-red))",
                  }}
                >
                  <Icon name="Flame" size={11} />
                  7 горящих
                </span>
              </div>
              <p className="text-xs" style={{ color: "hsl(var(--hr-muted))" }}>
                Остальные{" "}
                <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
                  16 вакансий
                </span>{" "}
                в работе
              </p>
            </div>

            {/* Время закрытия */}
            <div
              className="rounded-xl p-5 space-y-3 border"
              style={{
                background: "hsl(var(--hr-surface))",
                borderColor: "hsl(var(--hr-border))",
              }}
            >
              <div className="flex items-start justify-between">
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{ fontWeight: 500, color: "hsl(var(--hr-muted))" }}
                >
                  Закрытие вакансии
                </p>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(var(--hr-green-light))" }}
                >
                  <Icon
                    name="Clock"
                    size={14}
                    style={{ color: "hsl(var(--hr-green))" }}
                  />
                </div>
              </div>
              <div>
                <span
                  className="text-3xl tracking-tight"
                  style={{ fontWeight: 700, color: "hsl(var(--hr-green))" }}
                >
                  34
                </span>
                <span
                  className="text-sm ml-1"
                  style={{ color: "hsl(var(--hr-muted))" }}
                >
                  дня
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "#e8edf3" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "57%",
                      background: "hsl(var(--hr-green))",
                    }}
                  />
                </div>
                <span
                  className="text-xs whitespace-nowrap"
                  style={{ color: "hsl(var(--hr-muted))" }}
                >
                  60 дн max
                </span>
              </div>
              <p className="text-xs" style={{ color: "hsl(var(--hr-muted))" }}>
                Среднее по отрасли{" "}
                <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
                  28 дней
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="rounded-xl p-5 border"
            style={{
              background: "hsl(var(--hr-surface))",
              borderColor: "hsl(var(--hr-border))",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-sm"
                  style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
                >
                  Динамика численности
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "hsl(var(--hr-muted))" }}
                >
                  За 12 месяцев
                </p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{
                  fontWeight: 500,
                  background: "hsl(var(--hr-blue-light))",
                  color: "hsl(var(--hr-blue))",
                }}
              >
                2025–2026
              </span>
            </div>
            <LineChart
              data={headcountData}
              color="hsl(217, 91%, 42%)"
              minY={340}
              maxY={380}
              formatY={(v) => String(v)}
            />
            <div
              className="mt-3 pt-3 flex items-center gap-4 text-xs border-t"
              style={{
                color: "hsl(var(--hr-muted))",
                borderColor: "hsl(var(--hr-border))",
              }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-0.5 rounded-full inline-block"
                  style={{ background: "hsl(217, 91%, 42%)" }}
                />
                Факт
              </span>
              <span>
                Пик:{" "}
                <span
                  style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
                >
                  369 (май)
                </span>
              </span>
              <span>
                Мин:{" "}
                <span
                  style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
                >
                  348 (сент)
                </span>
              </span>
            </div>
          </div>

          <div
            className="rounded-xl p-5 border"
            style={{
              background: "hsl(var(--hr-surface))",
              borderColor: "hsl(var(--hr-border))",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-sm"
                  style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
                >
                  Динамика текучести
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "hsl(var(--hr-muted))" }}
                >
                  % за месяц
                </p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{
                  fontWeight: 500,
                  background: "hsl(var(--hr-red-light))",
                  color: "hsl(var(--hr-red))",
                }}
              >
                Выше нормы
              </span>
            </div>
            <LineChart
              data={turnoverData}
              color="hsl(0, 84%, 55%)"
              normLine={5}
              minY={3}
              maxY={10}
              formatY={(v) => v + "%"}
            />
            <div
              className="mt-3 pt-3 flex items-center gap-4 text-xs border-t"
              style={{
                color: "hsl(var(--hr-muted))",
                borderColor: "hsl(var(--hr-border))",
              }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-0.5 rounded-full inline-block"
                  style={{ background: "hsl(0, 84%, 55%)" }}
                />
                Факт
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-4 inline-block border-t border-dashed"
                  style={{ borderColor: "hsl(0, 84%, 55%)" }}
                />
                Норма 5%
              </span>
              <span>
                Рост с янв:{" "}
                <span
                  style={{ fontWeight: 600, color: "hsl(var(--hr-red))" }}
                >
                  +4,1 п.п.
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Staffing + Forecasts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Departments */}
          <div
            className="rounded-xl p-5 border"
            style={{
              background: "hsl(var(--hr-surface))",
              borderColor: "hsl(var(--hr-border))",
            }}
          >
            <h3
              className="text-sm mb-1"
              style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
            >
              Укомплектованность
            </h3>
            <p
              className="text-xs mb-5"
              style={{ color: "hsl(var(--hr-muted))" }}
            >
              % от штатного расписания
            </p>
            <div className="space-y-4">
              {departments.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-sm"
                      style={{ fontWeight: 500, color: "hsl(var(--foreground))" }}
                    >
                      {d.name}
                    </span>
                    <span
                      className="text-sm font-mono"
                      style={{ fontWeight: 700, color: d.color }}
                    >
                      {d.value}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "#e8edf3" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${d.value}%`, background: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-5 pt-4 border-t flex items-center justify-between text-xs"
              style={{ borderColor: "hsl(var(--hr-border))" }}
            >
              <span style={{ color: "hsl(var(--hr-muted))" }}>
                Средняя по компании
              </span>
              <span
                className="font-mono"
                style={{ fontWeight: 700, color: "hsl(var(--hr-blue))" }}
              >
                90,75%
              </span>
            </div>
          </div>

          {/* Forecasts */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm"
                style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
              >
                Прогноз на Q2 2026
              </h3>
              <span
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg"
                style={{
                  fontWeight: 500,
                  background: "hsl(var(--hr-blue-light))",
                  color: "hsl(var(--hr-blue))",
                }}
              >
                <Icon name="Sparkles" size={11} />
                Прогностическая модель
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {forecasts.map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl p-4 border flex flex-col space-y-3"
                  style={{
                    background: "hsl(var(--hr-surface))",
                    borderColor: "hsl(var(--hr-border))",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <p
                      className="text-xs leading-snug pr-2"
                      style={{ fontWeight: 500, color: "hsl(var(--hr-muted))" }}
                    >
                      {f.label}
                    </p>
                    <div
                      className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: f.bad
                          ? "hsl(var(--hr-red-light))"
                          : "hsl(var(--hr-blue-light))",
                      }}
                    >
                      <Icon
                        name={f.icon}
                        size={13}
                        style={{
                          color: f.bad
                            ? "hsl(var(--hr-red))"
                            : "hsl(var(--hr-blue))",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-2xl font-mono tracking-tight"
                      style={{
                        fontWeight: 700,
                        color: f.bad
                          ? "hsl(var(--hr-red))"
                          : "hsl(var(--hr-blue))",
                      }}
                    >
                      {f.value}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{
                        fontWeight: 500,
                        color: f.bad
                          ? "hsl(var(--hr-red))"
                          : "hsl(var(--hr-green))",
                      }}
                    >
                      {f.delta}
                    </div>
                  </div>
                  <p
                    className="text-xs leading-relaxed flex-1"
                    style={{ color: "hsl(var(--hr-muted))" }}
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="border-t pt-4 flex items-center justify-between"
          style={{ borderColor: "hsl(var(--hr-border))" }}
        >
          <p className="text-xs" style={{ color: "hsl(var(--hr-muted))" }}>
            Данные за Q1 2026 · Составлено автоматически · Только для внутреннего использования
          </p>
          <p
            className="text-xs font-mono"
            style={{ color: "hsl(var(--hr-muted))" }}
          >
            v1.0
          </p>
        </footer>
      </main>
    </div>
  );
}
