'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success('TRANSMISSION_SUCCESSFUL // Message queued for review.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="contact-grid">
          {/* Left — form */}
          <div className="contact-left">
            <div className="sys-label" style={{marginBottom:12}}>[SYS_COMMS_V4]</div>
            <h1 style={{fontSize:'clamp(28px,4vw,44px)',marginBottom:16,lineHeight:1.0}}>
              ESTABLISH<br/>CONNECTIVITY
            </h1>
            <p style={{color:'var(--text-secondary)',fontSize:14,lineHeight:1.7,marginBottom:40,maxWidth:400}}>
              Submit technical inquiries, collaboration requests, or procurement
              specifications via the secure interface below.
            </p>

            <form onSubmit={handleSubmit} style={{maxWidth:480}}>
              <div className="form-row form-row-2" style={{marginBottom:24}}>
                <div>
                  <div className="contact-field-num">01. Identifier / Name</div>
                  <input className="contact-input" value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="ENTRY_REQUIRED" required />
                </div>
                <div>
                  <div className="contact-field-num">02. Protocol / Email</div>
                  <input className="contact-input" type="email" value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="USER@NODE.SYS" required />
                </div>
              </div>

              <div style={{marginBottom:24}}>
                <div className="contact-field-num">03. Subject_Domain</div>
                <select className="contact-input" value={form.subject}
                  onChange={e => set('subject', e.target.value)} required>
                  <option value="">MECHANICAL_DESIGN_CONSULTATION</option>
                  <option value="design">Design Consultation</option>
                  <option value="procurement">Procurement Inquiry</option>
                  <option value="collaboration">Collaboration Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{marginBottom:32}}>
                <div className="contact-field-num">04. Data_Payload / Message</div>
                <textarea className="contact-input" rows={6} value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="TRANSMIT_DETAILS ..." required
                  style={{resize:'vertical'}} />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
                {sending ? 'TRANSMITTING...' : 'EXECUTE_TRANSMISSION →'}
              </button>
            </form>
          </div>

          {/* Right — contact info */}
          <div className="contact-right">
            <div style={{marginBottom:40}}>
              <div className="section-label" style={{marginBottom:20}}>Latency / Location</div>
              <div className="mono" style={{fontSize:15,lineHeight:2,color:'var(--text-primary)'}}>
                UNIT_7 // NODE_ALPHA<br/>
                INDUSTRIAL_SECTOR_04<br/>
                HO_CHI_MINH, VIETNAM
              </div>
            </div>

            <div style={{marginBottom:40}}>
              <div className="section-label" style={{marginBottom:20}}>Direct_Uplink</div>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div>
                  <div className="sys-label">Email_Interface</div>
                  <a href="mailto:ops@engineering-portfolio.v1" className="mono"
                    style={{fontSize:13,color:'var(--accent)',textDecoration:'none'}}>
                    ops@engineering-portfolio.v1
                  </a>
                </div>
                <div>
                  <div className="sys-label">Direct_Link</div>
                  <span className="mono" style={{fontSize:13}}>+84 (0) 123 456 789</span>
                </div>
              </div>
            </div>

            <div style={{display:'flex',gap:8,marginBottom:40}}>
              <a href="#" className="btn btn-outline btn-sm">LINKEDIN</a>
              <a href="#" className="btn btn-outline btn-sm">GITHUB</a>
              <a href="#" className="btn btn-outline btn-sm">CAD_REPO</a>
            </div>

            <div className="admin-card" style={{background:'var(--accent)',color:'white',border:'none',padding:20}}>
              <div className="mono" style={{fontSize:10,color:'rgba(255,255,255,0.5)',marginBottom:6}}>● OPERATIONAL_HQ</div>
              <div style={{background:'rgba(0,0,0,0.3)',padding:'16px',borderRadius:0}}>
                <div className="mono" style={{fontSize:11,color:'rgba(255,255,255,0.7)'}}>
                  SYS_STATUS: NOMINAL<br/>
                  VALIDATION: ISO-CERT-01<br/>
                  NEXT_SERVICE: 10,000 HRS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
