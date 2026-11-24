const BASE_URL = "http://localhost:8000/api";

export async function updateProfile(profileData, token) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch('http://localhost:8000/auth/profile', {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify(profileData),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `Erreur mise à jour profil (${res.status})`);
  }

  return data?.data?.user ?? data;
}

export async function getAllUsers(token) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch('http://localhost:8000/users', {
    method: 'GET',
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.message || `Erreur lors de la récupération des utilisateurs (${res.status})`
    );
  }

  return Array.isArray(data?.data?.users) ? data.data.users : [];
}

export async function createProjects(projectData, token) {
    const headers = {'Content-Type': 'application/json',};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch('http://localhost:8000/projects', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(projectData),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.message || `Erreur lors de la création (${res.status})`);
  }

  return res.json();
}

export async function createTask(projectId, taskData, token) {

   if (!projectId) {
    throw new Error("L'identifiant du projet est manquant.");
  }
    const headers = {'Content-Type': 'application/json',};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(taskData),
  });

  // export async function modifyTask(taskId, taskData, token)

  // if (!taskId) {
  //   throw new Error("L'identifiant de tâche est manquant.");
  // }
  // const headers = {'Content-Type': 'application/json',};
  // if (token) {
  //   headers.Authorization = `Bearer ${token}`;
  // }
  // const res = await fetch(`http://localhost:8000`)

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.message || `Erreur lors de la création (${res.status})`);
  }

  return res.json();
}

export async function getProjectsByUser(token) {

    const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch("http://localhost:8000/projects", {
    headers, credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const projects = await res.json();
  const projectList = projects?.data?.projects || []; // On extrait directement le tableau grâce au JSON fourni

  /*
    Sur chaque projet qu'on récupère on à un ID
    On fais une boucle for (parce qu'on connait le nombre de projets)
    Dans la boucle for :
      - On fait un fetch
      - On récupère le nombre de tâche terminée / le nombre de tâche totale
      - On modifie projectList pour y ajouter les informations sur chacun des projets
  */

  // Si pas de projet : on renvoit null
  if(projectList.length <= 0){
    return null
  }

  for(let i=0; i < projectList.length; i++){
    const id = projectList[i].id;

    // Récupération des tâches du projet
    const resTasks = await fetch(`http://localhost:8000/projects/${id}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    // Si pas de tâche trouvée, on passe à la suite
    if (!resTasks.ok) continue;

    const json = await resTasks.json()
    // Format à vérifier sur SWAGGER
    const tasks = json?.data?.tasks || []

    // Calcul des tâches
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task =>task.status === 'DONE').length; // À compléter
    
    // Ajout des informations au projet
    projectList[i].totalTasks = totalTasks;
    projectList[i].completedTasks = completedTasks;
    // Pour la progression, à toi de faire le calcul sur le front
  }

  return projectList;

}
export async function getProjectsById(id) {
  const res = await fetch("http://localhost:8000/projects", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })};