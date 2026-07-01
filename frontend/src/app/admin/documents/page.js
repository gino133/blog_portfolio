'use client';
import { useState, useEffect, useCallback } from 'react';
import { documentsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const TYPES = ['PDF', 'DWG', 'STEP', 'MANUAL', 'REPORT', 'OTHER'];

function DocForm({ doc, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: doc?.title || '', description: doc?.description || '',
    docId: doc?.docId || '', ref: doc?.ref || '',
    type: doc?.type || 'PDF', version: doc?.version || 'V1.0',
    fileUrl: doc?.fileUrl || '', category: doc?.category || '',
    isPublic: doc?.isPublic ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      doc ? await documentsAPI.update(doc._id, form) : await documentsAPI.create(form);
      toast.success(doc ? 'DOC_UPDATED' : 'DOC_INGESTED');
      onSave();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:24}}>
        <button onClick={onCancel} className="btn btn-ghost btn-sm">← Back</button>
        <h1 className="admin-page-title">{doc ? 'EDIT_DOCUMENT' : 'INGEST_DOCUMENT'}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-section-title">DOCUMENT_METADATA</div>
          <div className="form-group">
            <label className="form-label">Document Title *</label>
            <input className="input-box" value={form.title} onChange={e => set('title',e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="input-box" rows={2} value={form.description} onChange={e => set('description',e.target.value)} />
          </div>
          <div className="form-row form-row-3">
            <div className="form-group">
              <label className="form-label">Document_ID</label>
              <input className="input-box" value={form.docId} onChange={e => set('docId',e.target.value)} placeholder="SYS_MD_001" />
            </div>
            <div className="form-group">
              <label className="form-label">REF Number</label>
              <input className="input-box" value={form.ref} onChange={e => set('ref',e.target.value)} placeholder="8492-MK2" />
            </div>
            <div className="form-group">
              <label className="form-label">Version</label>
              <input className="input-box" value={form.version} onChange={e => set('version',e.target.value)} placeholder="V1.0.0" />
            </div>
          </div>
          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="input-box" value={form.type} onChange={e => set('type',e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input className="input-box" value={form.category} onChange={e => set('category',e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">File URL (download link)</label>
            <input className="input-box" type="url" value={form.fileUrl} onChange={e => set('fileUrl',e.target.value)} placeholder="https://..." />
          </div>
          <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
            <input type="checkbox" checked={form.isPublic} onChange={e => set('isPublic',e.target.checked)} style={{width:14,height:14}} />
            <span style={{fontFamily:'var(--font-mono)',fontSize:11,textTransform:'uppercase',letterSpacing:'0.06em'}}>Public Document</span>
          </label>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
          <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'PROCESSING...' : doc ? '↑ UPDATE_DOC' : '↑ INGEST_DOCUMENT'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await documentsAPI.adminGetAll({ limit: 30 });
      setDocs(res.data.documents || []); setTotal(res.data.total || 0);
    } catch { toast.error('Lỗi tải dữ liệu'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id) => {
    if (!confirm('Xóa tài liệu này?')) return;
    try { await documentsAPI.delete(id); toast.success('Đã xóa'); fetch(); }
    catch { toast.error('Lỗi khi xóa'); }
  };

  if (editing !== null) {
    return <DocForm doc={editing === 'new' ? null : editing}
      onSave={() => { setEditing(null); fetch(); }} onCancel={() => setEditing(null)} />;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tài liệu</h1>
          <div className="admin-page-sub">DOCUMENT_MATRIX // {total} ENTRIES</div>
        </div>
        <button onClick={() => setEditing('new')} className="btn btn-primary btn-sm">⊕ INGEST_DOCUMENT</button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div style={{padding:40,textAlign:'center',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)'}}>LOADING_REGISTRY...</div>
        ) : docs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▣</div>
            <div className="empty-text">No documents ingested</div>
            <button onClick={() => setEditing('new')} className="btn btn-primary btn-sm">Ingest First Document</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Document_ID</th>
                <th>Title</th>
                <th className="hide-m">Version</th>
                <th className="hide-m">Category</th>
                <th style={{textAlign:'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => (
                <tr key={doc._id}>
                  <td><span style={{fontFamily:'var(--font-mono)',fontSize:10,padding:'2px 6px',border:'1px solid var(--border)'}}>{doc.type}</span></td>
                  <td>
                    <div className="td-mono">{doc.docId || doc._id.slice(-8).toUpperCase()}</div>
                    {doc.ref && <div style={{fontSize:10,color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>REF:{doc.ref}</div>}
                  </td>
                  <td><div className="td-primary">{doc.title}</div></td>
                  <td className="hide-m"><span className="doc-version">{doc.version}</span></td>
                  <td className="hide-m td-muted">{doc.category || '—'}</td>
                  <td>
                    <div style={{display:'flex',justifyContent:'flex-end',gap:6}}>
                      {doc.fileUrl && <a href={doc.fileUrl} target="_blank" className="btn-icon-action" title="Download">↓</a>}
                      <button className="btn-icon-action" onClick={() => setEditing(doc)}>✎</button>
                      <button className="btn-icon-action danger" onClick={() => handleDelete(doc._id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
