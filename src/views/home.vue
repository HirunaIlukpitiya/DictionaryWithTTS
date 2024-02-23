<template>
  <div class="container mx-auto px-[10%] lg:px-[20%] py-[3%] min-h-screen">
    <div class="flex justify-between">
      <h1 class="font-sans text-5xl font-bold text-blue-600">Dictionary</h1>
      <ThemeToggle />
    </div>
    <br />
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <div class="relative mb-4 flex w-full flex-wrap items-stretch">
          <input
            type="text"
            class="rounded-l-lg relative m-0 -mr-0.5 dark:text-slate-400 block min-w-0 flex-auto border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder="Search"
            v-model="word"
          />
          <button
            class="relative rounded-r-lg z-[2] border-2 border-primary px-6 py-2 text-xs font-medium uppercase text-primary transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
            type="submit"
            id="button-addon3"
          >
            Search
          </button>
        </div>
      </div>
    </form>

    <div v-if="response" class="">
      <h1 class="font-sans text-5xl font-semibold text-blue-600">
        {{ word + " :" }}
      </h1>
      <div class="backdrop-blur-sm bg-white/30 rounded-md">
        <h1>test</h1>
      </div>
      <br />
      <!-- start of skeleton -->
      <div class="flex animate-pulse" v-if="this.isLoading">
        <Skeleton />
      </div>
      <div v-else>
        <template v-if="Object.keys(definitions).length === 0">
          <p>No definitions found.</p>
        </template>
        <template v-else>
          <div
            v-for="(definitionsArray, partOfSpeech) in definitions"
            :key="partOfSpeech"
          >
            <h2
              class="italic font-semibold text-2xl dark:text-blue-700 text-blue-700"
            >
              {{ partOfSpeech }} :
            </h2>
            <div v-for="definition in definitionsArray" :key="definition">
              <div class="flex justify-between">
                <ul class="marker:text-blue-600">
                  <li
                    class="not-italic font-normal list-disc text-justify text-xl dark:text-slate-400 text-black"
                  >
                    {{ definition }}
                  </li>
                </ul>
                <button
                  @click="defTTS(definition)"
                  class="text-3xl hover:scale-125"
                >
                  🔊
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Skeleton from "@/components/Skeleton.vue";
import ThemeToggle from "../components/themeToggle.vue";
var APIlink = "";
export default {
  components: {
    ThemeToggle,
    Skeleton,
  },
  data() {
    return {
      word: "",
      isLoading: false,
      voiceLoading: false,
      response: "",
      phonetic: "",
      errorMessage: "",
      definitions: {},
      phonetics: {},
    };
  },
  methods: {
    submitForm() {
      this.isLoading = true;
      const inputWord = this.word.trim().toLowerCase();
      APIlink = `https://api.dictionaryapi.dev/api/v2/entries/en/${inputWord}`;
      //console.log(inputWord);
      //console.log(APIlink);
      axios
        .get(APIlink, {})
        .then((response) => {
          console.log(response);
          this.response = response;
          this.processDefinitions();
          // console.log("dataArrayLength :", dataArrayLength);
          // console.log("dataArray : ", this.dataArray);
          // console.log("dataArrayNoun : ", this.dataArrayNoun);
          // console.log("dataArrayVerb : ", this.dataArrayVerb);

          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 404) {
            this.errorMessage = "No Definitions Found";
          }
          this.notifyError();
        });
    },

    processDefinitions() {
      this.definitions = {};
      this.phonetics = {};
      this.phonetics = new Set();
      this.response.data.forEach((entry) => {
        entry.meanings.forEach((meaning) => {
          const partOfSpeech = meaning.partOfSpeech.toLowerCase();
          if (!this.definitions[partOfSpeech]) {
            this.definitions[partOfSpeech] = [];
          }
          meaning.definitions.forEach((definition) => {
            this.definitions[partOfSpeech].push(definition.definition);
          });
        });

        entry.phonetics.forEach((phonetic) => {
          const text = phonetic.text;
          if (!this.phonetics[text]) {
            this.phonetics[text] = [];
          }
          this.phonetics[text].push(phonetic.audio);
        });
      });
      //this.phonetic = phonetic;
      console.log(this.phonetics);
      console.log(this.definitions);
    },

    defTTS(data) {
      const APIKey = "70f421f96b8443f8bf44b25b3717fbab";
      const APIlinkTts = `https://api.voicerss.org/?key=${APIKey}&hl=en-gb&v=Nancy&b64=true&f=48khz_16bit_stereo&c=MP3&src=${data}`;

      axios
        .get(APIlinkTts)
        .then((response) => {
          console.log(response);
          const base64AudioData = response.data;
          const decodedAudioData = atob(base64AudioData.split(",")[1]);

          const arrayBuffer = new ArrayBuffer(decodedAudioData.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < decodedAudioData.length; i++) {
            uint8Array[i] = decodedAudioData.charCodeAt(i);
          }
          const blob = new Blob([uint8Array], { type: "audio/mpeg" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio();
          audio.src = audioUrl;
          audio.play();
        })
        .catch((error) => {
          console.error("Error fetching TTS:", error);
        });
    },
    notifyError() {
      toast.error(`${this.errorMessage}!`, {
        autoClose: 2000,
        position: toast.POSITION.TOP_CENTER,
        transition: toast.TRANSITIONS.BOUNCE,
      });
      this.isLoading = false;
    },
  },
};
</script>
<style></style>
