<template>
  <div class="container mx-auto px-[10%] lg:px-[20%] py-[3%]">
    <h1 class="font-sans text-5xl font-bold text-blue-600">Dictionary</h1>
    <br />
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <div class="relative mb-4 flex w-full flex-wrap items-stretch">
          <input
            type="text"
            class="relative m-0 -mr-0.5 block min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder="Search"
            v-model="word"
          />
          <button
            class="relative z-[2] rounded-r border-2 border-primary px-6 py-2 text-xs font-medium uppercase text-primary transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
            type="submit"
            id="button-addon3"
          >
            Search
          </button>
        </div>
      </div>
    </form>
    <div v-if="response" class="marker:text-blue-600">
      <h1 class="font-sans text-3xl font-semibold text-blue-800">Results</h1>
      <br />
      <ol>
        <!-- start of skeleton -->
        <div class="flex animate-pulse" v-if="this.isLoading">
          <div class="flex-shrink-0">
            <span
              class="size-12 block bg-gray-200 rounded-full dark:bg-gray-700"
            ></span>
          </div>

          <div class="ms-4 mt-2 w-full">
            <h3
              class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"
              style="width: 40%"
            ></h3>

            <ul class="mt-5 space-y-3">
              <li
                class="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"
              ></li>
              <li
                class="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"
              ></li>
              <li
                class="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"
              ></li>
              <li
                class="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"
              ></li>
            </ul>
          </div>
        </div>
        <!-- end of the skeleton -->
        <li v-if="this.dataArrayNoun.length != 0" class="italic font-semibold text-2xl text-blue-700">
          noun :
          <div v-for="data in this.dataArrayNoun">
            <ul>
              <div class="flex justify-between">
              <li class="not-italic font-normal list-disc text-justify text-xl text-black">
                {{ data }}
              </li>
              <button @click="defTTS(data)" class="text-3xl hover:scale-125">🔊</button>
            </div>
            </ul>
          </div>
        </li>
        <br />
        <li v-if="this.dataArrayVerb.length != 0" class="italic font-semibold text-2xl text-blue-700">
          verb :
          <div v-for="data in this.dataArrayVerb">
            <ul>
              <div class="flex justify-between">
              <li class="not-italic font-normal list-disc text-justify text-xl text-black">
                {{ data }}
              </li>
              <button @click="defTTS(data)" class="text-3xl hover:scale-125">🔊</button>
            </div>
            </ul>
          </div>
        </li>
        <br>
        <li v-if="this.dataArrayAdjectives.length != 0" class="italic font-semibold text-blue-700 text-2xl">
          adjective :
          <div v-for="data in this.dataArrayAdjectives">
            <ul>
              <div class="flex justify-between">
              <li class="not-italic font-normal list-disc text-justify text-xl text-black">
                {{ data }}
              </li>
              <button @click="defTTS(data)" class="text-3xl hover:scale-125">🔊</button>
            </div>
            </ul>
          </div>
        </li>
        <br>
        <li v-if="this.dataArrayAdverb.length != 0" class="italic font-semibold text-2xl text-blue-700">
          adverb :
          <div v-for="data in this.dataArrayAdverb">
            <ul>
              <div class="flex justify-between">
              <li class="not-italic font-normal list-disc text-justify text-xl text-black">
                {{ data }}
              </li>
              <button @click="defTTS(data)" class="text-3xl hover:scale-125">🔊</button>
            </div>
            </ul>
          </div>
        </li>
        <br>
        <li v-if="this.dataArrayInterjection.length != 0" class="italic font-semibold text-2xl text-blue-700">
          interjection :
          <div v-for="data in this.dataArrayInterjection">
            <ul>
            <div class="flex justify-between">
              <li class="not-italic font-normal list-disc text-justify text-xl text-black">
                {{ data }}
              </li>
              <button @click="defTTS(data)" class="text-3xl hover:scale-125">🔊</button>
            </div>
            </ul>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
var inputWord = "";
var APIlink = "";
var errorMessage = "";
var dataArrayLength = 0;
export default {
  data() {
    return {
      word: "",
      isLoading: false,
      response: "",
      dataArray: [],
      refArray: [],
      dataArrayNoun: [],
      dataArrayVerb: [],
      dataArrayAdverb: [],
      dataArrayAdjectives: [],
      dataArrayInterjection: [],
      synonyms: [],
      phonetic: "",
    };
  },
  methods: {
    submitForm() {
      this.dataArray = [];
      this.refArray = [];
      this.dataArrayNoun = [];
      this.dataArrayVerb = [];
      this.dataArrayAdverb = [];
      this.dataArrayAdjectives = [];
      this.synonyms = [];
      this.dataArrayInterjection = [];
      inputWord = this.word;
      this.isLoading = true;
      APIlink = `https://api.dictionaryapi.dev/api/v2/entries/en/${inputWord}`;
      //console.log(inputWord);
      //console.log(APIlink);
      axios
        .get(APIlink, {})
        .then((response) => {
          console.log(response);
          this.response = response;
          for (let i = 0; i < this.response.data.length; i++) {
            this.refArray = [];
            this.refArray = this.response.data[i].meanings;
            for (let i = 0; i < this.refArray.length; i++) {
              this.dataArray.push(this.refArray[i]);
            }
          }
          this.refArray = [];
          dataArrayLength = this.dataArray.length;
          for (let i = 0; i < dataArrayLength; i++) {
            if (this.dataArray[i].partOfSpeech === "noun") {
              let arrayElementLength = this.dataArray[i].definitions.length;
              // console.log("arrayElementLength :", arrayElementLength);
              this.refArray = this.dataArray[i].definitions;
              // console.log("refArray : ", this.refArray);
              for (let r = 0; r < arrayElementLength; r++) {
                this.dataArrayNoun.push(this.refArray[r].definition);
              }
              this.refArray = [];
            } else if(this.dataArray[i].partOfSpeech === "verb"){
              let arrayElementLength = this.dataArray[i].definitions.length;
              // console.log("arrayElementLength :", arrayElementLength);
              this.refArray = this.dataArray[i].definitions;
              // console.log("refArray : ", this.refArray);
              for (let r = 0; r < arrayElementLength; r++) {
                this.dataArrayVerb.push(this.refArray[r].definition);
              }
              this.refArray = [];
            }
            else if(this.dataArray[i].partOfSpeech === "adjective"){
              let arrayElementLength = this.dataArray[i].definitions.length;
              // console.log("arrayElementLength :", arrayElementLength);
              this.refArray = this.dataArray[i].definitions;
              // console.log("refArray : ", this.refArray);
              for (let r = 0; r < arrayElementLength; r++) {
                this.dataArrayAdjectives.push(this.refArray[r].definition);
              }
              this.refArray = [];

            }
            else if(this.dataArray[i].partOfSpeech === "adverb"){
              let arrayElementLength = this.dataArray[i].definitions.length;
              // console.log("arrayElementLength :", arrayElementLength);
              this.refArray = this.dataArray[i].definitions;
              // console.log("refArray : ", this.refArray);
              for (let r = 0; r < arrayElementLength; r++) {
                this.dataArrayAdverb.push(this.refArray[r].definition);
              }
              this.refArray = [];

            }
            else if(this.dataArray[i].partOfSpeech === "interjection"){
              let arrayElementLength = this.dataArray[i].definitions.length;
              // console.log("arrayElementLength :", arrayElementLength);
              this.refArray = this.dataArray[i].definitions;
              // console.log("refArray : ", this.refArray);
              for (let r = 0; r < arrayElementLength; r++) {
                this.dataArrayInterjection.push(this.refArray[r].definition);
              }
              this.refArray = [];

            }
          }
          // console.log("dataArrayLength :", dataArrayLength);
          // console.log("dataArray : ", this.dataArray);
          // console.log("dataArrayNoun : ", this.dataArrayNoun);
          // console.log("dataArrayVerb : ", this.dataArrayVerb);

          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 404) {
            errorMessage = "No Definitions Found";
          }
          this.notifyError();
        });
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
      toast.error(`${errorMessage}!`, {
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
