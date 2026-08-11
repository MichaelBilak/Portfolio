"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronDown, Code2, Plus, Save, Trash2 } from "lucide-react";
import { fieldLabel, useStudioI18n } from "@/lib/studio/i18n";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const HIDDEN_KEYS = new Set([
  "id", "created_at", "updated_at", "project_id", "service_id",
  "category_id", "item_id", "step_id", "case_id",
]);

function isRecord(value: JsonValue): value is Record<string, JsonValue> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function updateAtPath(
  value: JsonValue,
  path: Array<string | number>,
  next: JsonValue,
): JsonValue {
  if (!path.length) return next;
  const [head, ...tail] = path;
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      index === Number(head) ? updateAtPath(item, tail, next) : item,
    );
  }
  if (isRecord(value)) {
    return { ...value, [head]: updateAtPath(value[String(head)], tail, next) };
  }
  return value;
}

function emptyLike(value: JsonValue | undefined): JsonValue {
  if (isRecord(value as JsonValue)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, JsonValue>).map(([key, item]) => [
        key,
        HIDDEN_KEYS.has(key) ? item : emptyLike(item),
      ]),
    );
  }
  if (Array.isArray(value)) return [];
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  return "";
}

function FieldEditor({
  fieldKey,
  value,
  path,
  onChange,
}: {
  fieldKey: string;
  value: JsonValue;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: JsonValue) => void;
}) {
  const { t, locale } = useStudioI18n();
  if (HIDDEN_KEYS.has(fieldKey)) return null;
  const label = fieldLabel(locale, fieldKey);

  if (Array.isArray(value)) {
    const objectArray = value.some(isRecord);
    return (
      <section className="st-field-group">
        <div className="st-field-group-head">
          <div>
            <strong>{label}</strong>
            <small>{t("editor.itemsCount", { count: value.length })}</small>
          </div>
          <button
            type="button"
            className="st-btn subtle"
            onClick={() => onChange(path, [...value, emptyLike(value[0])])}
          >
            <Plus size={14} /> {t("editor.add")}
          </button>
        </div>
        <div className={objectArray ? "st-array-cards" : "st-simple-list"}>
          {value.map((item, index) =>
            objectArray && isRecord(item) ? (
              <details className="st-array-card" key={index} open={index === 0}>
                <summary>
                  <span>
                    {String(
                      item.locale ||
                      item.name ||
                      item.title ||
                      item.tier_id ||
                      `${label} ${index + 1}`,
                    )}
                  </span>
                  <ChevronDown size={15} />
                </summary>
                <div className="st-array-card-body">
                  {Object.entries(item).map(([key, nested]) => (
                    <FieldEditor
                      key={key}
                      fieldKey={key}
                      value={nested}
                      path={[...path, index, key]}
                      onChange={onChange}
                    />
                  ))}
                  <button
                    type="button"
                    className="st-btn danger subtle"
                    onClick={() =>
                      onChange(path, value.filter((_, itemIndex) => itemIndex !== index))
                    }
                  >
                    <Trash2 size={14} /> {t("editor.delete")}
                  </button>
                </div>
              </details>
            ) : (
              <div className="st-list-row" key={index}>
                <input
                  className="st-input"
                  value={String(item ?? "")}
                  onChange={(event) =>
                    onChange([...path, index], event.target.value)
                  }
                  aria-label={`${label} ${index + 1}`}
                />
                <button
                  type="button"
                  className="st-icon-btn danger"
                  onClick={() =>
                    onChange(path, value.filter((_, itemIndex) => itemIndex !== index))
                  }
                  aria-label={`${t("common.remove")} ${label} ${index + 1}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          )}
          {!value.length ? <p className="st-empty-inline">{t("editor.emptyItems")}</p> : null}
        </div>
      </section>
    );
  }

  if (isRecord(value)) {
    return (
      <section className="st-field-group">
        <div className="st-field-group-head"><strong>{label}</strong></div>
        <div className="st-field-grid">
          {Object.entries(value).map(([key, nested]) => (
            <FieldEditor
              key={key}
              fieldKey={key}
              value={nested}
              path={[...path, key]}
              onChange={onChange}
            />
          ))}
        </div>
      </section>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="st-toggle">
        <span>
          <strong>{label}</strong>
          <small>{value ? t("common.enabled") : t("common.disabled")}</small>
        </span>
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
        />
      </label>
    );
  }

  const longText =
    typeof value === "string" &&
    (value.length > 90 ||
      /description|subtitle|details|problem|solution|impact|brief|bio|footnote|body/i.test(fieldKey));

  return (
    <label className={`st-label ${longText ? "st-field-wide" : ""}`}>
      <span>{label}</span>
      {longText ? (
        <textarea
          className="st-textarea"
          value={value === null ? "" : String(value)}
          onChange={(event) => onChange(path, event.target.value)}
        />
      ) : (
        <input
          className="st-input"
          type={typeof value === "number" ? "number" : "text"}
          value={value === null ? "" : String(value)}
          onChange={(event) =>
            onChange(
              path,
              typeof value === "number" ? Number(event.target.value) : event.target.value,
            )
          }
        />
      )}
    </label>
  );
}

export function JsonResourceEditor({
  endpoint,
  initial,
  title,
}: {
  endpoint: string;
  initial: unknown;
  title?: string;
}) {
  const router = useRouter();
  const { t } = useStudioI18n();
  const [value, setValue] = useState<JsonValue>(
    (initial === undefined ? null : initial) as JsonValue,
  );
  const [advanced, setAdvanced] = useState(false);
  const [text, setText] = useState(() => JSON.stringify(initial, null, 2));
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setMsg("");
    setError("");
    setSaving(true);
    let parsed = value;
    if (advanced) {
      try {
        parsed = JSON.parse(text) as JsonValue;
      } catch {
        setError(t("editor.jsonError"));
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || t("editor.saveFailed"));
        return;
      }
      setValue(parsed);
      setText(JSON.stringify(parsed, null, 2));
      setMsg(t("editor.saved"));
      await fetch("/api/studio/revalidate", { method: "POST" });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function handleChange(path: Array<string | number>, next: JsonValue) {
    setValue((current) => updateAtPath(current, path, next));
    setMsg("");
  }

  return (
    <div className="st-friendly-editor">
      {title ? <h2>{title}</h2> : null}
      <div className="st-editor-toolbar">
        <div>
          <strong>{advanced ? t("editor.modeAdvanced") : t("editor.modeForm")}</strong>
          <small>
            {advanced ? t("editor.modeAdvancedHint") : t("editor.modeFormHint")}
          </small>
        </div>
        <button
          type="button"
          className="st-btn subtle"
          onClick={() => {
            if (!advanced) setText(JSON.stringify(value, null, 2));
            setAdvanced((current) => !current);
          }}
        >
          <Code2 size={15} />
          {advanced ? t("editor.switchForm") : t("editor.switchAdvanced")}
        </button>
      </div>

      {advanced ? (
        <textarea
          className="st-textarea st-code-editor"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      ) : isRecord(value) ? (
        <div className="st-resource-form">
          {Object.entries(value).map(([key, item]) => (
            <FieldEditor
              key={key}
              fieldKey={key}
              value={item}
              path={[key]}
              onChange={handleChange}
            />
          ))}
        </div>
      ) : (
        <FieldEditor
          fieldKey="value"
          value={value}
          path={[]}
          onChange={handleChange}
        />
      )}

      <div className="st-save-bar">
        <div>
          {error ? <span className="st-error">{error}</span> : null}
          {msg ? <span className="st-ok"><Check size={15} /> {msg}</span> : null}
        </div>
        <button
          type="button"
          className="st-btn primary"
          onClick={save}
          disabled={saving}
        >
          <Save size={16} /> {saving ? t("editor.saving") : t("common.save")}
        </button>
      </div>
    </div>
  );
}
