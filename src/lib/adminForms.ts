export function parseLineList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function stringifyLineList(values: string[] | undefined) {
  return values?.join("\n") ?? "";
}

export function parseOptionalLineList(value: string) {
  const items = parseLineList(value);
  return items.length ? items : undefined;
}

export function parseLinkRows(value: string) {
  return value
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [label = "", to = "", description = ""] = row.split("|").map((item) => item.trim());
      return {
        label,
        to,
        description: description || undefined,
      };
    });
}

export function stringifyLinkRows(values: Array<{ label: string; to: string; description?: string }> | undefined) {
  return (
    values
      ?.map((item) => [item.label, item.to, item.description ?? ""].join(" | "))
      .join("\n") ?? ""
  );
}

export function parseKeyValuePairs(value: string) {
  return value
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [key = "", valuePart = ""] = row.split("|").map((item) => item.trim());
      return {
        heading: key,
        body: valuePart,
      };
    });
}

export function stringifyKeyValuePairs(values: Array<{ heading: string; body: string }> | undefined) {
  return (
    values
      ?.map((item) => [item.heading, item.body].join(" | "))
      .join("\n") ?? ""
  );
}

export function parseLeadershipRows(value: string) {
  return value
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [name = "", title = "", bio = ""] = row.split("|").map((item) => item.trim());
      return { name, title, bio };
    });
}

export function stringifyLeadershipRows(values: Array<{ name: string; title: string; bio: string }> | undefined) {
  return (
    values
      ?.map((item) => [item.name, item.title, item.bio].join(" | "))
      .join("\n") ?? ""
  );
}
