import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../utils/toast';
import { resolveAvatarUrl, defaultAvatarLetter } from '../../utils/avatarUrl';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

export default function EditProfileModal({ open, onClose }) {
  const { user, applyProfile, fetchProfile } = useAuth();
  const fileRef = useRef(null);
  const [username, setUsername] = useState(user?.username || '');
  const [displayName, setDisplayName] = useState(user?.displayName || user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [preview, setPreview] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setUsername(user?.username || '');
    setDisplayName(user?.displayName || user?.name || '');
    setBio(user?.bio || '');
    setPreview(resolveAvatarUrl(user?.profilePicture));
    setPendingFile(null);
    setErrors({});
  }, [open, user]);

  const onPickFile = useCallback((file) => {
    if (!file) return;
    if (!ACCEPT.split(',').some((t) => file.type === t.trim())) {
      showToast('Use JPG, PNG, WebP, or GIF', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Max file size is 10MB', 'error');
      return;
    }
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    onPickFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      if (pendingFile) {
        const up = await api.uploadAvatar(pendingFile);
        if (up.profile) applyProfile(up.profile);
      }
      const data = await api.updateProfile({
        email: user.email,
        username: username.trim(),
        displayName: displayName.trim(),
        bio: bio.trim(),
      });
      if (data.profile) applyProfile(data.profile);
      await fetchProfile();
      showToast('Profile updated');
      onClose();
    } catch (err) {
      if (err.data?.errors) setErrors(err.data.errors);
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const data = await api.removeAvatar();
      setPreview(null);
      setPendingFile(null);
      if (data.profile) applyProfile(data.profile);
      showToast('Avatar removed');
    } catch (err) {
      showToast(err.message || 'Could not remove avatar', 'error');
    }
  };

  if (!open) return null;

  const letter = defaultAvatarLetter(displayName);

  return (
    <AnimatePresence>
      <motion.div
        className="profile-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="profile-modal auth-glass-panel"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="profile-modal-header">
            <h2>Edit Profile</h2>
            <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>

          <motion.div
            className={`avatar-drop-zone${dragOver ? ' drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            whileHover={{ borderColor: 'rgba(100, 180, 255, 0.6)' }}
          >
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT}
              hidden
              onChange={(e) => onPickFile(e.target.files?.[0])}
            />
            <div className="avatar-preview-ring">
              {preview ? (
                <img src={preview} alt="Avatar preview" className="avatar-preview-img" />
              ) : (
                <span className="avatar-preview-letter">{letter}</span>
              )}
            </div>
            <p className="drop-hint">Drag & drop or click — JPG, PNG, WebP, GIF (max 10MB)</p>
            <motion.div className="avatar-modal-actions">
              <button type="button" className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                Choose file
              </button>
              {(preview || user?.profilePicture) && (
                <button type="button" className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); handleRemoveAvatar(); }}>
                  Remove
                </button>
              )}
            </motion.div>
          </motion.div>

          <motion.div className="form-group">
            <label className="form-label">Username</label>
            <input
              className={`form-input${errors.username ? ' input-invalid' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p className="field-error">{errors.username}</p>}
          </motion.div>
          <motion.div className="form-group">
            <label className="form-label">Display name</label>
            <input
              className="form-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </motion.div>
          <motion.div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              className="form-input"
              rows={3}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the colony about your learning goals…"
            />
          </motion.div>

          <motion.button
            type="button"
            className="btn btn-primary form-btn"
            disabled={saving}
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
