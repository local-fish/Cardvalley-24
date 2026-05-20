<script lang="ts">
  import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { setUserData } from '$lib/userData';

  let step: number = $state(0); // 0 = menu, 1 = consent, 2 = user data, 3 = instructions, 4 = pre-level

  // user data form
  let name: string = $state('');
  let age: string = $state('');
  let gender: string = $state('');
  let org: string = $state('');
  // add whatever other fields you need

  function next() {
    if (step === 4) goto(resolve('/game'));
    if (step === 2){
      setUserData({name, age, gender, org});
      step++;
    }
    else step++;
  }
</script>

<div class="page">
  {#if step === 0}
    <button class="start" onclick={() => step++}>Start</button>

  {:else if step === 1}
    <div class="backdrop">
      <div class="panel">
        <h2>Informed Consent</h2>
        <p>
          Data yang Anda berikan akan dijamin kerahasiaannya. Seluruh data yang terkumpul sepenuhnya milik Pengukuran Psikologis dan Fakultas Psikologi UBAYA yang hanya akan digunakan untuk kepentingan penelitian. Oleh karena itu, kami mengharapkan data Anda isi dengan sejujur-jujurnya.</p>

        <p>Apabila Anda tidak ingin meneruskan permainan ini lebih lanjut, pada titik kapanpun Anda diizinkan untuk meninggalkan permainan dengan mengetuk tombol "give up."</p>
        <button class="next-btn" onclick={next}>Next →</button>
      </div>
    </div>


  {:else if step === 2}
    <div class="backdrop">
      <div class="panel">
        <h2>Data Diri</h2>
        <label>
          Nama
          <input bind:value={name} type="text" placeholder="Nama anda" />
        </label>
        <label>
          Umur
          <input bind:value={age} type="number" placeholder="Umur anda" />
        </label>
        <div class="field">
        <span>
          Jenis Kelamin
        </span>
          <div class="gender-options">
            <button
              class="gender-btn"
              class:selected={gender === 'L'}
              onclick={() => gender = 'L'}
            >Laki - Laki</button>
            <button
              class="gender-btn"
              class:selected={gender === 'P'}
              onclick={() => gender = 'P'}
            >Perempuan</button>
            <button
              class="gender-btn"
              class:selected={gender === 'N'}
              onclick={() => gender = 'N'}
            >Memilih Tidak Menjawab</button>
          </div>
        </div>
        <div class="field">
          <span>Asal Instansi</span>
          <div class="gender-options">
            <button
              class="gender-btn"
              class:selected={org === 'Ubaya'}
              onclick={() => org = 'Ubaya'}
            >Ubaya</button>
            <button
              class="gender-btn"
              class:selected={org === 'Non-Ubaya'}
              onclick={() => org = 'Non-Ubaya'}
            >Non-Ubaya</button>
          </div>
        </div>
        <button class="next-btn" disabled={!name || !age || parseInt(age) < 17 || parseInt(age) > 120 || !gender || !org} onclick={next}>Next →</button>
      </div>
    </div>

  {:else if step === 3}
    <div class="backdrop">
      <div class="panel">
        <h2>Cara Bermain</h2>
        <p>Pada permainan ini, kamu akan diberikan beberapa kartu angka. Tugasmu adalah untuk menggabungkan semua kartu angka menggunakan operasi matematika yang diberikan untuk mencapai angka 24. 
Kamu bebas menentukan urutan dan cara penyelesaiannya, asalkan hasilnya menghasilkan 24.</p>
<p>Kamu memiliki 5 nyawa. Apabila kamu salah mengerjakan soal, kamu akan kehilangan 1 nyawa. Apabila kamu mau melewati satu nomor, kamu bisa menggunakan tombol "skip".</p>

        <button class="next-btn" onclick={next}>Next →</button>
      </div>
    </div>

  {:else if step === 4}
    <div class="backdrop">
      <div class="panel">
        <h2>Level 1</h2>
        <p>Kamu akan diberikan 4 kartu angka, dan 4 operasional</p>
        <button class="next-btn" onclick={next}>Let's Go!</button>
      </div>
    </div>
  {/if}
</div>


<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
  .panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 245, 220, 0.92);
    padding: 2rem 2.5rem;
    border-radius: 20px;
    max-width: 480px;
    box-shadow: 0 8px 0 rgba(0,0,0,0.15);
    text-align: center;
  }

  .panel h2 {
    margin: 0;
    font-size: 1.6rem;
    color: #7a3d00;
  }

  .panel p {
    color: #5a3000;
    line-height: 1.6;
    margin: 0;
  }

  .panel label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    width: 100%;
    color: #7a3d00;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .panel input {
    width: 100%;
    padding: 8px 12px;
    border-radius: 10px;
    border: 2px solid #c8873a;
    font-size: 1rem;
    box-sizing: border-box;
    outline: none;
  }

  .panel input:focus {
    border-color: #e8622a;
  }

  .next-btn {
    background: #6abf5e;
    border: 3px solid #3a8a30;
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    padding: 10px 36px;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 4px 0 #2a6a20;
    transition: transform 0.1s ease;
    margin-top: 0.5rem;
  }

  .next-btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .next-btn:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #2a6a20;
  }

  .next-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  :global(html, body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url('/menu-background.png');
    background-size: cover;
    background-position: center;
  }

  .start {
    position: absolute;
    background: #6abf5e;
    border: 3px solid #3a8a30;
    color: white;
    font-size: 1.4rem;
    font-weight: bold;
    padding: 12px 48px;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 4px 0 #2a6a20;
    transition: transform 0.1s ease;
    bottom: 10rem;
  }

  .start:hover {
    transform: translateY(-2px);
  }

  .start:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #2a6a20;
  }

  .gender-options {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    justify-content: center;
  }

  .gender-btn {
    padding: 8px 0;
    border-radius: 10px;
    border: 2px solid #c8873a;
    background: white;
    color: #7a3d00;
    font-weight: bold;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.1s ease, transform 0.1s ease;
    flex: 0 0 auto;
    padding: 8px 16px;
  }

  .gender-btn:hover {
    background: #fad88a;
    transform: translateY(-1px);
  }

  .gender-btn.selected {
    background: #e8622a;
    border-color: #a03a0a;
    color: white;
  }

  .field {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    width: 100%;
    color: #7a3d00;
    font-weight: bold;
    font-size: 0.9rem;
  } 
</style>
