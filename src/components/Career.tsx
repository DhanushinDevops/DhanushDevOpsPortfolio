import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>DevOps Engineer</h4>
                <h5>iAgami Technologies - Trichy, Tamil Nadu, India</h5>
              </div>
              <h3>Aug 2025 - Current</h3>
            </div>
            <p>
              • Independently managed Dev, QA, Staging, and Production environments, handling deployments, monitoring, and production support with minimal supervision.<br />
              • Designed and managed AWS infrastructure for multiple projects, including networking, security, scalability, and high-availability architecture.<br />
              • Built and maintained CI/CD pipelines using GitLab CI/CD and Jenkins with Blue-Green deployment and rollback strategies for reliable zero/minimal downtime releases.<br />
              • Automated infrastructure and deployment workflows using Terraform, Ansible, Docker, and Kubernetes, improving operational efficiency and scalability.<br />
              • Monitored and optimized applications using CloudWatch, Grafana, and Prometheus while troubleshooting critical production issues and ensuring system stability.<br />
              • Implemented DevSecOps practices with SonarQube and Trivy and collaborated closely with development teams to accelerate secure and stable releases.<br />
              • Led AWS cost optimization initiatives, reducing cloud infrastructure costs by approximately 70% through resource rightsizing, architecture improvements, automation, and efficient resource utilization.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>DevOps Engineer</h4>
                <h5>Samin Tekmindz India - Noida, Uttar Pradesh, India</h5>
              </div>
              <h3>April 2024 - June 2025</h3>
            </div>
            <p>
              • Accelerated deployment cycles by 30% through robust CI/CD pipelines using GitLab CI, ensuring fast and reliable software releases.<br />
              • Implemented Git-based version control, enabling effective collaboration across development teams and maintaining code integrity in repositories.<br />
              • Designed and deployed containerization strategies with Docker and Kubernetes, improving resource efficiency by 25% and streamlining environment management.<br />
              • Monitored and optimized continuous integration/deployment processes, resolving build and release failures to achieve 98% pipeline uptime.<br />
              • Provided 24/7 operational support by monitoring critical services using AWS CloudWatch, ensuring zero downtime during peak traffic events.<br />
              • Automated repetitive tasks with Python and Bash scripts, enhancing team productivity by 25% and reducing manual effort.<br />
              • Conducted security scans using Trivy and SonarQube, mitigating vulnerabilities early and reducing security risks.<br />
              • Configured and optimized Nginx web servers with Terraform and Ansible, improving load balancing and performance by 10%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Certifications</h4>
              </div>
            </div>
            <p>
              <strong>May 2025</strong><br />
              • DevSecOps Principles - Codecademy [SCORE: 90%]<br />
              <br />
              <strong>December 2023</strong><br />
              • PEGACPSA88V1 - Certified Pega System Architect 8.8 [SCORE: 82%]<br />
              <br />
              <strong>December 2023</strong><br />
              • PEGACPSSA88V1 - Certified Pega Senior System Architect 8.8 [SCORE: 81%]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
