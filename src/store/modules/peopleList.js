import axios from "axios";
import utilities from "../../mixins/utilities";

const state = {
  doctors: [],
  nurses: [],
  insurances: [],
  servants: [],
  currentShift: {},
  userName: "",
  role:""
};
const getters = {
  drNames: state => {
    return state.doctors;
  },
  shiftDetails: state => {
    return state.currentShift;
  },
  nurseNames: state => {
    return state.nurses;
  },
  insurTypes: state => {
    return state.insurances;
  },
  servantNames: state => {
    return state.servants;
  },
  currentInfo: state => {
    return state.currentShift;
  },
  userName: state => {
    return state.userName;
  },
  role: state => {
    return state.role;
  }
};
const actions = {
  getDocs({ commit }) {
    axios
      .post(
        utilities.data().baseUrl +
          "/clinic/requirements/requirementsInfoForShift",
        {},
        {
          headers: {
            Authorization: "Bearer: " + window.localStorage.token
          }
        }
      )
      .then(res => {
        const mapDocs = res.data.allDoctors.map(x => {
          return {
            id: x.id,
            code: x.id,
            value: x.id,
            text: x.name,
            nameW: x.nameW,
            label: x.name
          };
        });
        const mapNurses = res.data.allNureses.map(x => {
          return {
            id: x.id,
            code: x.id,
            value: x.id,
            text: x.name,
            label: x.name
          };
        });
        const mapInsurances = res.data.allInsurances.map(x => {
          return {
            id: x.id,
            code: x.id,
            value: x.id,
            text: x.name,
            label: x.name
          };
        });
        const mapServants = res.data.allServants.map(x => {
          return {
            id: x.id,
            code: x.id,
            value: x.id,
            text: x.name,
            label: x.name
          };
        });
        commit("setDocs", mapDocs);
        commit("setNurses", mapNurses);
        commit("setInsurances", mapInsurances);
        commit("setServants", mapServants);
      })
      .catch(() => {
        alert("مشکلی پیش آمده، لطفا مجددا صفحه را بارگذاری نمائید");
      });
  },
  getCurrent({ commit }) {
    axios
      .post(
        utilities.data().baseUrl + "/clinic/shift/current",
        {},
        {
          headers: {
            Authorization: "Bearer: " + window.localStorage.token
          }
        }
      )
      .then(res => {
        const current = res.data;
        commit("setCurrent", current);
      })
      .catch(() => {
        alert("مشکلی پیش آمده، لطفا مجددا صفحه را بارگذاری نمائید");
      });
  },
  getUserName({ commit }) {
    axios
      .post(
        utilities.data().baseUrl + "/clinic/requirements/checkToken",
        {},
        {
          headers: {
            Authorization: "Bearer: " + window.localStorage.token
          }
        }
      )
      .then(res => {
        const name = res.data.name;
        const role = res.data.role;
        commit("setUserName", name);
        commit("setRole", role);
      })
      .catch(() => {
        alert("مشکلی پیش آمده، لطفا مجددا صفحه را بارگذاری نمائید");
      });
  }
};
const mutations = {
  setDocs: (state, docs) => {
    state.doctors = docs;
  },
  setNurses: (state, nurses) => {
    state.nurses = nurses;
  },
  setInsurances: (state, insurances) => {
    state.insurances = insurances;
  },
  setServants: (state, servants) => {
    state.servants = servants;
  },
  setCurrent: (state, currentShift) => {
    state.currentShift = currentShift;
  },
  setUserName: (state, name) => {
    state.userName = name;
  },
  setRole: (state, role) => {
    state.role = role;
  }
};
export default {
  state,
  getters,
  mutations,
  actions
};
