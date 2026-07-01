import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const experience = [
  { title: 'PRINCIPAL_SYSTEMS_ARCHITECT', company: 'NEURAL_FABRICATIONS_INC', period: '2020 — PRESENT',
    desc: 'Leading the development of autonomous assembly lines for aerospace components. Implementing real-time stress monitoring systems using custom sensor arrays and ML-driven predictive maintenance.' },
  { title: 'SENIOR_MECHANICAL_ENGINEER', company: 'HEAVY_LOGIC_BOTICS', period: '2017 — 2020',
    desc: 'Designed high-torque actuator systems for undersea exploration vehicles. Reduced mechanical failure rates by 34% through redesigned hydraulic manifold architectures.' },
  { title: 'ROBOTICS_FIELD_OPERATIVE', company: 'KINETIC_SOLUTIONS_CORP', period: '2014 — 2017',
    desc: 'On-site deployment and optimization of rapid-prototyping units in extreme environment facilities. Specialized in thermal management for high-precision components.' },
];

const credentials = [
  { tag: '[MSc_ENG]', title: 'MASSACHUSETTS_INSTITUTE_OF_TECH', desc: 'Advanced Robotics & Autonomous Systems Design. Focus on multi-agent coordination.' },
  { tag: '[CERT-082]', title: 'PROFESSIONAL_ENGINEER_(PE)', desc: 'Certified for Structural Mechanics and Heavy Machinery Safety Standards.' },
  { tag: '[CERT-991]', title: 'LEAN_SIX_SIGMA_BLACK_BELT', desc: 'Expertise in process optimization and industrial waste reduction methodologies.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="container" style={{paddingTop:48,paddingBottom:64}}>
          <div style={{display:'grid',gridTemplateColumns:'340px 1fr',gap:48}} className="about-grid">
            {/* Left photo column */}
            <div>
              <div style={{aspectRatio:'1',background:'#1a1a18',position:'relative',marginBottom:16,overflow:'hidden'}}>
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80" alt="Lead engineer"
                  style={{width:'100%',height:'100%',objectFit:'cover',filter:'grayscale(1)'}} />
                <div style={{position:'absolute',bottom:0,left:0,right:0,background:'var(--accent)',color:'white',padding:'8px 12px'}}>
                  <span className="mono" style={{fontSize:11}}>LEAD_ENGINEER_ID: 882-AX</span>
                </div>
              </div>

              <div className="section-label" style={{marginBottom:14}}>Technical_Stack</div>
              <div className="admin-card" style={{marginBottom:10}}>
                <div className="info-box-label">[SYS-DESIGN]</div>
                <div className="skill-tags" style={{marginTop:8}}>
                  <span className="skill-tag">AUTOCAD</span>
                  <span className="skill-tag">SOLIDWORKS</span>
                  <span className="skill-tag">MATLAB</span>
                  <span className="skill-tag">ANSYS</span>
                </div>
              </div>
              <div className="admin-card">
                <div className="info-box-label">[CONTROL-LOGIC]</div>
                <div className="skill-tags" style={{marginTop:8}}>
                  <span className="skill-tag">PYTHON</span>
                  <span className="skill-tag">C++</span>
                  <span className="skill-tag">ROS</span>
                  <span className="skill-tag">PLC_PROG</span>
                </div>
              </div>
            </div>

            {/* Right content */}
            <div>
              <h1 style={{fontSize:'clamp(28px,4vw,40px)',marginBottom:24,paddingBottom:20,borderBottom:'1px solid var(--border)'}}>
                SYSTEM_OVERVIEW
              </h1>
              <p style={{color:'var(--text-secondary)',lineHeight:1.8,marginBottom:20}}>
                Focusing on the intersection of <strong>computational design</strong> and structural integrity.
                I develop mechanical systems that prioritize functional efficiency and long-term reliability.
                My approach is rooted in the philosophy of industrial brutalism — where form is the direct
                result of rigorous engineering constraints.
              </p>
              <p style={{color:'var(--text-secondary)',lineHeight:1.8,marginBottom:40}}>
                With over 8 years of experience in specialized robotics and industrial automation,
                I have led cross-functional teams to deliver mission-critical infrastructure.
                I view every project as a dataset to be optimized, ensuring that every weld, line of code,
                and material choice contributes to a singular, robust objective.
              </p>

              <div className="section-label">Deployment_History</div>
              <div style={{display:'flex',flexDirection:'column',gap:28,marginBottom:48}}>
                {experience.map((e,i) => (
                  <div key={i} style={{borderLeft:'2px solid var(--accent)',paddingLeft:20}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
                      <h3 style={{fontSize:16,letterSpacing:'0.02em'}}>{e.title}</h3>
                      <span className="badge badge-gray">{e.period}</span>
                    </div>
                    <div className="mono" style={{fontSize:11,color:'var(--text-muted)',margin:'4px 0 10px'}}>{e.company}</div>
                    <p style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6}}>{e.desc}</p>
                  </div>
                ))}
              </div>

              <div className="section-label">Credentials_Matrix</div>
              <div className="cards-grid cards-grid-3" style={{border:'1px solid var(--border)',marginBottom:48}}>
                {credentials.map((c,i) => (
                  <div key={i} className="skill-card">
                    <div className="skill-card-num">{c.tag}</div>
                    <div className="skill-card-title" style={{fontSize:12}}>{c.title}</div>
                    <div className="skill-card-desc" style={{marginBottom:0}}>{c.desc}</div>
                  </div>
                ))}
              </div>

              <div className="admin-card text-center" style={{padding:40,background:'var(--bg-muted)'}}>
                <h2 style={{fontSize:22,marginBottom:10}}>INITIATE_COLLABORATION</h2>
                <p style={{color:'var(--text-secondary)',marginBottom:24,fontSize:13}}>
                  Currently accepting inquiries for specialized engineering consultations and high-complexity systems design projects.
                </p>
                <Link href="/contact" className="btn btn-primary">Download_Full_Dossier ↓</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`@media (max-width: 900px) { .about-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
