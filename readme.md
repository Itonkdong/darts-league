# Darts League Application

A web-based platform to track and manage dart games among interns at my internship.
Originally built as a fun side project to keep score in our friendly competitions, this application also serves as a showcase of modern web development and DevOps practices — from containerization and CI/CD to Kubernetes deployment.

---

## Features

* View profiles of registered dart players (interns).
* Record games, scores, and winners — including uploading winner photos.
* Track player statistics and view dynamic leaderboards.
* Admin-controlled player management tied to IT Labs accounts.

---

## Tech Stack & Tools

For this project, React was used to build a dynamic and responsive user interface, while Spring Boot provided a robust backend framework for developing RESTful APIs and handling business logic. MongoDB served as a flexible NoSQL database ideal for storing player profiles and game records. Docker was used to containerize the application, ensuring consistent environments across development and production, and Docker Compose simplified running multiple services locally. Kubernetes handled production-grade orchestration and scaling of the application components. GitHub was used for version control, with GitHub Actions automating the CI/CD pipeline to build, test, and deploy the application seamlessly. Finally, NGINX served the frontend static files and acted as a reverse proxy to route API requests efficiently.

---

## Running Locally with Docker Compose

> Make sure you have **Docker** and **Docker Compose** installed.

```bash
git clone https://github.com/itonkdong/darts-league.git
cd darts-league
docker-compose up --build
```

* The frontend will be available at: [http://localhost](http://localhost)
* The backend API will be at: [http://localhost:8080/api](http://localhost:8080/api)

Data persists in Docker volumes for MongoDB and uploaded images.

---

## Deploying with Kubernetes

This project is production-ready with Kubernetes manifests included under `/kubernetes`.

* It uses:

  * A dedicated `darts-league` namespace
  * MongoDB StatefulSet with PersistentVolumeClaims
  * ConfigMaps & Secrets for configuration
  * Deployments & Services for backend and frontend
  * Ingress for external access on `darts-league.local`

> Apply everything using:

```bash
kubectl apply -f kubernetes/{manifest.yaml}
```

Make sure to set up your local DNS (e.g. in `/etc/hosts`) to point `darts-league.local` to your cluster ingress IP.

---

## CI/CD Pipeline

* Automated with **GitHub Actions**
* On every push to `master`:

  * Builds backend & frontend Docker images
  * Pushes images to Docker Hub:

    * `itonkdong/darts-league-backend:latest`
    * `itonkdong/darts-league-frontend:latest`

---

## Project Structure

```
darts-league/
├── backend-spring/     # Spring Boot backend
├── frontend/           # React frontend
├── kubernetes/         # All K8s manifests
└── docker-compose.yml  # Local orchestration
```

---

## Tools & Official Links

* [React](https://react.dev)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [MongoDB](https://www.mongodb.com)
* [Docker](https://www.docker.com)
* [Docker Compose](https://docs.docker.com/compose/)
* [Kubernetes](https://kubernetes.io)
* [GitHub](https://github.com)
* [GitHub Actions](https://github.com/features/actions)
* [NGINX](https://www.nginx.com)

---

## License & Credits

This project was developed by Viktor Kostadinoski as a fun internal tool and as part of the course Continuous Integration and Delivery (DevOps). Teacher were Panche Ribarski and Stefan Andonov.

---

