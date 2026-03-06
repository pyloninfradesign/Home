"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { ArrowLeft, Search, Trash2, Ban } from "lucide-react";

export type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  disabled: boolean | null;
};

export function UsersTable({ users }: { users: UserRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const hay = `${u.email ?? ""} ${u.name ?? ""} ${u.role ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, users]);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black">
            <ArrowLeft size={16} /> Admin
          </Link>
          <Breadcrumb items={[{ label: "Users" }]} />
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          New User
        </Link>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-800">Users</span>
          <span className="text-neutral-500">Invite customers or create staff accounts.</span>
        </div>
        <label className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 focus-within:border-black">
          <Search size={16} className="text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email or name"
            className="w-52 text-sm outline-none placeholder:text-neutral-400"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last login</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-800">
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-neutral-500" colSpan={6}>
                  No users match your search.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{u.email}</span>
                      {u.name && <span className="text-xs text-neutral-500">{u.name}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{u.role ?? "customer"}</td>
                  <td className="px-4 py-3">
                    {u.disabled ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                        ● Disabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        ● Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {u.last_sign_in_at
                      ? formatDistanceToNow(new Date(u.last_sign_in_at), { addSuffix: true })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {u.created_at
                      ? formatDistanceToNow(new Date(u.created_at), { addSuffix: true })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-3 text-neutral-600">
                      <ActionButton
                        formAction={`/admin/users/${u.id}/toggle`}
                        name="disabled"
                        value={u.disabled ? "false" : "true"}
                        confirmText={`Are you sure you want to ${u.disabled ? "activate" : "disable"} ${u.email}?`}
                        label={u.disabled ? "Activate" : "Disable"}
                        icon={Ban}
                        destructive={!u.disabled}
                      />
                      <ActionButton
                        formAction={`/admin/users/${u.id}/delete`}
                        confirmText={`Delete ${u.email}? This cannot be undone.`}
                        label="Delete"
                        icon={Trash2}
                        destructive
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

type ActionButtonProps = {
  formAction: string;
  name?: string;
  value?: string;
  confirmText: string;
  label: string;
  destructive?: boolean;
  icon?: React.ComponentType<{ size?: number }>;
};

function ActionButton({ formAction, name, value, confirmText, label, destructive, icon: Icon }: ActionButtonProps) {
  const actionUrl = formAction.startsWith("http")
    ? formAction
    : formAction.startsWith("/")
      ? formAction
      : `${formAction}`;
  return (
    <form
      action={actionUrl}
      method="post"
      className="inline-flex items-center"
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) {
          e.preventDefault();
        }
      }}
    >
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        type="submit"
        className={`inline-flex items-center gap-1 text-xs font-medium underline-offset-2 ${
          destructive ? "text-rose-600 hover:text-rose-700" : "text-neutral-700 hover:text-black"
        }`}
      >
        {Icon ? <Icon size={14} /> : null}
        {label}
      </button>
    </form>
  );
}
