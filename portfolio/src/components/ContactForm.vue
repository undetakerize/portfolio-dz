<script setup>
import { ref, reactive } from 'vue'
import ActionIcon from './ActionIcon.vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)
const feedback = reactive({
  type: '', // 'success' | 'error'
  text: '',
})

async function submitContact() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  feedback.type = ''
  feedback.text = ''

  try {
    const res = await fetch('/api/v1/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    const body = await res.json()

    if (!res.ok) {
      throw new Error(body.message || 'Gagal mengirim pesan. Silakan coba lagi.')
    }

    feedback.type = 'success'
    feedback.text = 'Pesan terkirim ke backend. Terima kasih atas pesannya!'
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (err) {
    feedback.type = 'error'
    feedback.text = err.message || 'Terjadi kesalahan jaringan.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="contact-form" @submit.prevent="submitContact">
    <div class="form-grid">
      <div class="form-group">
        <label for="contact-name" class="form-label mono">NAME *</label>
        <input
          id="contact-name"
          v-model.trim="form.name"
          type="text"
          class="form-input"
          placeholder="Nama Anda"
          required
          maxlength="100"
          :disabled="isSubmitting"
        />
      </div>
      <div class="form-group">
        <label for="contact-email" class="form-label mono">EMAIL *</label>
        <input
          id="contact-email"
          v-model.trim="form.email"
          type="email"
          class="form-input"
          placeholder="email@example.com"
          required
          maxlength="150"
          :disabled="isSubmitting"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="contact-subject" class="form-label mono">SUBJECT *</label>
      <input
        id="contact-subject"
        v-model.trim="form.subject"
        type="text"
        class="form-input"
        placeholder="Topik / Rencana Kolaborasi"
        required
        maxlength="200"
        :disabled="isSubmitting"
      />
    </div>

    <div class="form-group">
      <label for="contact-message" class="form-label mono">MESSAGE *</label>
      <textarea
        id="contact-message"
        v-model.trim="form.message"
        class="form-textarea"
        rows="4"
        placeholder="Tuliskan pesan Anda di sini..."
        required
        maxlength="2000"
        :disabled="isSubmitting"
      ></textarea>
    </div>

    <div class="form-footer">
      <button
        type="submit"
        class="button-primary submit-btn"
        :disabled="isSubmitting"
      >
        <span>{{ isSubmitting ? 'SENDING...' : 'SEND MESSAGE' }}</span>
        <ActionIcon name="external" />
      </button>

      <p
        v-if="feedback.text"
        :class="['form-status', feedback.type, 'mono']"
        role="status"
      >
        {{ feedback.text }}
      </p>
    </div>
  </form>
</template>

<style scoped>
.contact-form {
  margin-top: 32px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.form-input,
.form-textarea {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--rule);
  color: var(--text);
  padding: 10px 14px;
  font-family: inherit;
  font-size: 0.9rem;
  border-radius: 0;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.06);
}

.form-textarea {
  resize: vertical;
  min-height: 90px;
}

.form-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 6px;
}

.submit-btn {
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-status {
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}

.form-status.success {
  color: #4ade80;
}

.form-status.error {
  color: #f87171;
}
</style>
