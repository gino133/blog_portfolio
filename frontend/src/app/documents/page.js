import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { documentsAPI } from '@/lib/api';

async function getDocs() {
  try {
    const res = await documentsAPI.getAll({ limit: 20 });
    return res.data.documents || [];
  } catch { return []; }
}

const typeIcon = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('pdf')) return '📄';
  if (t.includes('dwg') || t.includes('draw')) return '▲';
  if (t.includes('step') || t.includes('3d')) return '◈';
  if (t.includes('manual') || t.includes('guide')) return '📘';
  return '▣';
};

export default async function DocumentsPage() {
  const docs = await getDocs();

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="container" style={{paddingTop:48,paddingBottom:64}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:40,flexWrap:'wrap',gap:16}}>
            <div>
              <h1 style={{fontSize:'clamp(28px,4vw,44px)',marginBottom:10}}>DOCUMENT_MATRIX</h1>
              <div className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>
                ACTIVE_SESSION: [USR_ADMIN_09]
              </div>
            </div>
          </div>

          <div className="admin-table-wrap" style={{marginBottom:40}}>
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Document_ID</th>
                  <th>Description</th>
                  <th className="hide-m">Revision</th>
                  <th className="hide-m">Timestamp</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.length > 0 ? docs.map(doc => (
                  <tr key={doc._id}>
                    <td style={{fontSize:18,opacity:0.5}}>{typeIcon(doc.type)}</td>
                    <td>
                      <div className="td-mono">{doc.docId || doc._id.slice(-8).toUpperCase()}</div>
                      <div style={{fontSize:10,color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>
                        REF:{doc.ref || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="td-primary" style={{fontSize:13}}>{doc.title}</div>
                      {doc.description && (
                        <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>{doc.description}</div>
                      )}
                    </td>
                    <td className="hide-m">
                      <span className="doc-version">{doc.version || 'V1.0'}</span>
                    </td>
                    <td className="hide-m td-muted">
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td>
                      {doc.fileUrl ? (
                        <a href={doc.fileUrl} target="_blank" className="btn btn-ghost btn-sm">↓</a>
                      ) : (
                        <span style={{fontSize:13,color:'var(--text-muted)'}}>—</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  /* Sample rows when empty */
                  [
                    { id: 'SYS_MD_001_A', ref: '8492-MK2', desc: 'Primary Structural Load-Bearing Schematics', ver: 'V4.2.0', date: '2024-05-12' },
                    { id: 'MAT_SPEC_Z_03', ref: 'ISO-9001', desc: 'Alloy Density & Stress Resistance Analysis', ver: 'V6.1.1', date: '2024-04-28' },
                    { id: 'USR_MAN_BETA', ref: 'BETA-X', desc: 'Field Operator Interface Manual', ver: 'V0.9.0', date: '2024-04-25' },
                    { id: 'MAN_PROC_STEP_01', ref: 'FAC-12', desc: 'Precision Milling Calibration Steps', ver: 'V2.0.0', date: '2024-04-20' },
                  ].map((s,i) => (
                    <tr key={i}>
                      <td style={{fontSize:18,opacity:0.3}}>▣</td>
                      <td>
                        <div className="td-mono">{s.id}</div>
                        <div style={{fontSize:10,color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>REF:{s.ref}</div>
                      </td>
                      <td><div className="td-primary" style={{fontSize:13,opacity:0.4}}>{s.desc}</div></td>
                      <td className="hide-m"><span className="doc-version" style={{opacity:0.4}}>{s.ver}</span></td>
                      <td className="hide-m td-muted">{s.date}</td>
                      <td><span style={{fontSize:12,color:'var(--text-muted)'}}>—</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {docs.length === 0 && (
              <div style={{padding:'12px 16px',background:'var(--accent-light)',borderTop:'1px solid var(--border)'}}>
                <span className="mono" style={{fontSize:10,color:'var(--accent)'}}>
                  ⚠ SAMPLE_DATA — Thêm tài liệu từ trang admin để hiển thị dữ liệu thực
                </span>
              </div>
            )}
          </div>

          {/* Features section */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}} className="doc-features-grid">
            <div style={{aspectRatio:'16/9',background:'#1a1a18',position:'relative',overflow:'hidden'}}>
              <img src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=700&q=80"
                alt="Mechanical validation"
                style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.6}} />
              <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,0.8))',padding:24}}>
                <div style={{fontSize:14,fontWeight:700,color:'white',marginBottom:6}}>MECHANICAL_VALIDATION</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.6)'}}>Real-time stress analysis and structural integrity documentation.</div>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div className="admin-card" style={{background:'var(--accent)',color:'white',border:'none',flex:1}}>
                <div style={{fontSize:22,marginBottom:8}}>🔒</div>
                <div style={{fontWeight:700,fontSize:14,marginBottom:8}}>SECURE_ARCHIVE</div>
                <div className="mono" style={{fontSize:11,color:'rgba(255,255,255,0.6)',lineHeight:1.6}}>
                  AES-256 encrypted storage for sensitive engineering schematics.
                </div>
              </div>
              <div className="admin-card" style={{flex:1}}>
                <div style={{fontSize:22,marginBottom:8}}>📋</div>
                <div style={{fontWeight:700,fontSize:14,marginBottom:8}}>VERSION_CONTROL</div>
                <div className="mono" style={{fontSize:11,color:'var(--text-muted)',lineHeight:1.6}}>
                  Full audit trail and differential tracking for all technical documentation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`@media(max-width:768px){.doc-features-grid{grid-template-columns:1fr !important}}`}</style>
    </>
  );
}
