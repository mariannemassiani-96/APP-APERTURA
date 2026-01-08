const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type ProjectPayload = {
  name: string;
  building_type: string;
};

type OpeningPayload = {
  type: string;
  width: number;
  height: number;
  quantity: number;
};

type UserPayload = {
  email: string;
  password: string;
  role: 'admin' | 'sales';
};

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export function getProjects() {
  return apiFetch('/projects');
}

export function createProject(payload: ProjectPayload) {
  return apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getOpenings(projectId: number) {
  return apiFetch(`/projects/${projectId}/openings`);
}

export function createOpening(projectId: number, payload: OpeningPayload) {
  return apiFetch(`/projects/${projectId}/openings`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getUsers() {
  return apiFetch('/admin/users');
}

export function createUser(payload: UserPayload) {
  return apiFetch('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { API_URL };
