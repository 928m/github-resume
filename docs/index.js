const token = '72333370bdebd676e3c3fae763949151d0dc36e0';
const accessToken = `?access_token=${token}`;
const userIdInput = document.querySelector('.user-id').querySelector('input');
const submitBtn = document.querySelector('.btn-submit');
const getUserIdWrap = document.querySelector('.get-user-id-wrap');
const lodingWrap = document.querySelector('.loding');
const resumeWrap = document.querySelector('.resume-wrap');
const lodingUserEl = lodingWrap.querySelector('.user');
let user = null;

userIdInput.addEventListener('blur', (ev) => {
  if (ev.target.value) {
    document.querySelector('.user-id').classList.add('on');
  } else {
    document.querySelector('.user-id').classList.remove('on');
  }
});

submitBtn.addEventListener('click', () => {
  user = userIdInput.value;
  getUserIdWrap.style.display = 'none';
  lodingWrap.style.display = 'block';
  resumeWrap.style.display = 'block';

  const avatarEl = document.querySelector('.avatar').querySelector('img');
  const nameEl = document.querySelector('.name');
  const locationEl = document.querySelector('.location');
  const bioEl = document.querySelector('.bio');
  const companyEl = document.querySelector('.company');
  const blogEl = document.querySelector('.blog');
  const createdEl = document.querySelector('.created');
  const updatedEl = document.querySelector('.updated');
  const userPortfolioListEl = document.querySelector('.user-portfolio-wrap ul');

  function timeTextSlice(timeString) {
    let sliceIndex = timeString.lastIndexOf('-');
    timeString = timeString.slice(0, sliceIndex);

    return timeString;
  }

  axios.get(`https://api.github.com/users/${user}${accessToken}`)
  .then(function(response) {
    if (response.data.followers > response.data.following && response.data.followers >= 50) {
      const popularWrap = document.createElement('div');
      const pEl = document.createElement('p');
      const spanEl = document.createElement('span');
      const followerEl = document.createElement('span');
      const followingEl = document.createElement('span');
      spanEl.textContent = 'POPULAR';
      spanEl.classList.add('pop-title');
      followerEl.textContent = `FOLLOWERS : ${response.data.followers}`;
      followingEl.textContent = `FOLLOWING : ${response.data.following}`;

      pEl.appendChild(spanEl);
      pEl.appendChild(followerEl);
      pEl.appendChild(followingEl);

      popularWrap.appendChild(pEl);
      popularWrap.classList.add('popular-user');
      document.querySelector('.user-wrap').appendChild(popularWrap);
    }

    avatarEl.src = response.data.avatar_url;

    if (response.data.name) {
      lodingUserEl.textContent = response.data.name;
      nameEl.textContent = response.data.name;
    } else {
      nameEl.textContent = user;
      lodingUserEl.textContent = user;
    }

    if (response.data.location) {
      const iconEl = document.createElement('i');
      iconEl.classList.add('xi-maker');
      locationEl.textContent = response.data.location;
      locationEl.prepend(iconEl);
    } else {
      locationEl.style.display = 'none';
    }

    if (response.data.blog) {
      blogEl.href = response.data.blog;
      blogEl.setAttribute('target', '_blank');
    }

    if (response.data.name) {
      blogEl.textContent = `${response.data.name} website`;
    } else {
      blogEl.textContent = `${user} website`;
    }

    bioEl.textContent = response.data.bio;
    companyEl.textContent = response.data.company;
    createdEl.textContent = timeTextSlice(response.data.created_at);
    updatedEl.textContent = timeTextSlice(response.data.updated_at);

    axios.get(`${response.data.repos_url}${accessToken}`)
    .then(function(allReposResponse) {
      if (allReposResponse.data.length === 0) {
        lodingWrap.classList.add('remove');
        setTimeout(() => {
          lodingWrap.style.display = 'none';
        }, 1500);
      } else {
        const userTotalRepository = [];
        const languageKeys = {};
        const languageDatas = [];
        let count = 0;
        let totalLanguage = 0;

        for (let i = 0; i < allReposResponse.data.length; i++) {
          axios.get(`${allReposResponse.data[i].url}${accessToken}`)
          .then(function(reposResponse) {
            count++;

            if (!reposResponse.data.parent) {
              userTotalRepository.push({
                id: reposResponse.data.id,
                name: reposResponse.data.name,
                description: reposResponse.data.description,
                create: reposResponse.data.created_at,
                update: reposResponse.data.updated_at,
                html: reposResponse.data.html_url,
                language: reposResponse.data.language,
                language_url: reposResponse.data.language_url,
                stargazers: reposResponse.data.stargazers_count,
                forks: reposResponse.data.forks
              });

              languageDatas.push(axios.get(`${reposResponse.data.languages_url}${accessToken}`));
            }

            if (count === allReposResponse.data.length) {
              if (userTotalRepository.length === 0) {
                lodingWrap.classList.add('remove');
                setTimeout(() => {
                  lodingWrap.style.display = 'none';
                }, 1500);
              } else {
                lodingWrap.classList.add('remove');
                setTimeout(() => {
                  lodingWrap.style.display = 'none';
                }, 1500);

                userTotalRepository.sort((a, b) => {
                  if (a.stargazers < b.stargazers) {
                    return 1;
                  } else if (a.stargazers > b.stargazers) {
                    return -1;
                  } else {
                    if (new Date(a.update) < new Date(b.update)) {
                      return 1;
                    } else if (new Date(a.update) > new Date(b.update)) {
                      return -1;
                    } else {
                      return 0;
                    }
                  }
                });

                for (let i = 0; i < userTotalRepository.length; i++) {
                  let item = userTotalRepository[i];
                  const liEl = document.createElement('li');
                  const linkEl = document.createElement('a');
                  const nameEl = document.createElement('p');
                  const ownerEl = document.createElement('span');
                  const descriptionEl = document.createElement('p');
                  const languageEl = document.createElement('span');
                  const dateWrapEl = document.createElement('div');
                  const createdEl = document.createElement('span');
                  const updatedEl = document.createElement('span');

                  nameEl.classList.add('name');
                  ownerEl.classList.add('owner');
                  descriptionEl.classList.add('description');
                  languageEl.classList.add('lang');
                  dateWrapEl.classList.add('date');

                  nameEl.textContent = item.name;
                  descriptionEl.textContent = item.description;
                  languageEl.textContent = item.language;
                  linkEl.href = item.html;
                  linkEl.setAttribute('target', '_blank');
                  createdEl.textContent = timeTextSlice(item.create);
                  updatedEl.textContent = timeTextSlice(item.update);
                  dateWrapEl.appendChild(createdEl);
                  dateWrapEl.appendChild(updatedEl);

                  linkEl.appendChild(nameEl);
                  linkEl.appendChild(ownerEl);
                  linkEl.appendChild(descriptionEl);
                  linkEl.appendChild(dateWrapEl);
                  linkEl.appendChild(languageEl);

                  if (item.stargazers) {
                    const stargazerEl = document.createElement('span');
                    stargazerEl.classList.add('star');
                    stargazerEl.textContent = item.stargazers;

                    const iconEl = document.createElement('i');
                    iconEl.classList.add('xi-star');
                    stargazerEl.prepend(iconEl);
                    linkEl.appendChild(stargazerEl);
                  }

                  if (item.language) {
                    let lang = item.language.split(' ');
                    lang = lang.join('');
                    liEl.classList.add(lang.toLowerCase());
                  }

                  liEl.appendChild(linkEl);
                  userPortfolioListEl.appendChild(liEl);
                }

                Promise.all(languageDatas)
                .then((response) => {
                  for (let i = 0; i < response.length; i++) {
                    let languageResponse = response[i];

                    for (let key in languageResponse.data) {
                      if (languageKeys.hasOwnProperty(key)) {
                        languageKeys[key] = languageKeys[key] + languageResponse.data[key];
                        totalLanguage += languageResponse.data[key];
                      } else {
                        languageKeys[key] = languageResponse.data[key];
                        totalLanguage += languageResponse.data[key];
                      }
                    }

                    if (i === response.length - 1) {
                      let delay = 0;
                      const languageAreaEl = document.querySelector('.language');

                      for (let key in languageKeys) {
                        if (Math.round(languageKeys[key] / totalLanguage * 100) > 0) {
                          const liEl = document.createElement('li');
                          const languageEl = document.createElement('span');
                          const gageBarEl = document.createElement('div');
                          languageEl.classList.add('lang');
                          languageEl.textContent = key;
                          languageEl.style.transition = `all .5s ${delay * 0.35}s`;
                          languageEl.style.opacity = 0;
                          languageEl.style.transform = 'translateY(20px)';
                          gageBarEl.classList.add('gage');

                          let lang = key.split(' ');
                          lang = lang.join('');
                          lang = lang.toLowerCase();
                          liEl.classList.add(lang);

                          delay++;

                          gageBarEl.classList.add(lang);
                          gageBarEl.style.transition = `all .5s ${delay * 0.35}s`;
                          gageBarEl.style.width = 0;

                          setTimeout(() => {
                            languageEl.style.opacity = 1;
                            languageEl.style.transform = 'translateY(0)';

                            liEl.style.width = Math.round(languageKeys[key] / totalLanguage * 100) + '%';
                            gageBarEl.style.width = 100 + '%';
                          }, 100);

                          liEl.appendChild(languageEl);
                          liEl.appendChild(gageBarEl);
                          languageAreaEl.appendChild(liEl);
                        }
                      }
                    }
                  }
                });
              }
            }
          }).catch(err => {
            console.log('ERROR:', err.response.status);

            if (err.response.status === 451) {
              count++;

              if (count === allReposResponse.data.length) {
                if (userTotalRepository.length === 0) {
                  lodingWrap.classList.add('remove');
                  setTimeout(() => {
                    lodingWrap.style.display = 'none';
                  }, 1500);
                } else {
                  lodingWrap.classList.add('remove');
                  setTimeout(() => {
                    lodingWrap.style.display = 'none';
                  }, 1500);

                  userTotalRepository.sort((a, b) => {
                    if (a.stargazers < b.stargazers) {
                      return 1;
                    } else if (a.stargazers > b.stargazers) {
                      return -1;
                    } else {
                      if (new Date(a.update) < new Date(b.update)) {
                        return 1;
                      } else if (new Date(a.update) > new Date(b.update)) {
                        return -1;
                      } else {
                        return 0;
                      }
                    }
                  });

                  for (let i = 0; i < userTotalRepository.length; i++) {
                    let item = userTotalRepository[i];
                    const liEl = document.createElement('li');
                    const linkEl = document.createElement('a');
                    const nameEl = document.createElement('p');
                    const ownerEl = document.createElement('span');
                    const descriptionEl = document.createElement('p');
                    const languageEl = document.createElement('span');
                    const dateWrapEl = document.createElement('div');
                    const createdEl = document.createElement('span');
                    const updatedEl = document.createElement('span');

                    nameEl.classList.add('name');
                    ownerEl.classList.add('owner');
                    descriptionEl.classList.add('description');
                    languageEl.classList.add('lang');
                    dateWrapEl.classList.add('date');

                    nameEl.textContent = item.name;
                    descriptionEl.textContent = item.description;
                    languageEl.textContent = item.language;
                    linkEl.href = item.html;
                    linkEl.setAttribute('target', '_blank');
                    createdEl.textContent = timeTextSlice(item.create);
                    updatedEl.textContent = timeTextSlice(item.update);
                    dateWrapEl.appendChild(createdEl);
                    dateWrapEl.appendChild(updatedEl);

                    linkEl.appendChild(nameEl);
                    linkEl.appendChild(ownerEl);
                    linkEl.appendChild(descriptionEl);
                    linkEl.appendChild(dateWrapEl);
                    linkEl.appendChild(languageEl);

                    if (item.stargazers) {
                      const stargazerEl = document.createElement('span');
                      stargazerEl.classList.add('star');
                      stargazerEl.textContent = item.stargazers;

                      const iconEl = document.createElement('i');
                      iconEl.classList.add('xi-star');
                      stargazerEl.prepend(iconEl);
                      linkEl.appendChild(stargazerEl);
                    }

                    if (item.language) {
                      let lang = item.language.split(' ');
                      lang = lang.join('');
                      liEl.classList.add(lang.toLowerCase());
                    }

                    liEl.appendChild(linkEl);
                    userPortfolioListEl.appendChild(liEl);
                  }

                  Promise.all(languageDatas)
                  .then((response) => {
                    for (let i = 0; i < response.length; i++) {
                      let languageResponse = response[i];

                      for (let key in languageResponse.data) {
                        if (languageKeys.hasOwnProperty(key)) {
                          languageKeys[key] = languageKeys[key] + languageResponse.data[key];
                          totalLanguage += languageResponse.data[key];
                        } else {
                          languageKeys[key] = languageResponse.data[key];
                          totalLanguage += languageResponse.data[key];
                        }
                      }

                      if (i === response.length - 1) {
                        let delay = 0;
                        const languageAreaEl = document.querySelector('.language');

                        for (let key in languageKeys) {
                          if (Math.round(languageKeys[key] / totalLanguage * 100) > 0) {
                            const liEl = document.createElement('li');
                            const languageEl = document.createElement('span');
                            const gageBarEl = document.createElement('div');
                            languageEl.classList.add('lang');
                            languageEl.textContent = key;
                            languageEl.style.transition = `all .5s ${delay * 0.35}s`;
                            languageEl.style.opacity = 0;
                            languageEl.style.transform = 'translateY(20px)';
                            gageBarEl.classList.add('gage');

                            let lang = key.split(' ');
                            lang = lang.join('');
                            lang = lang.toLowerCase();
                            liEl.classList.add(lang);

                            delay++;

                            gageBarEl.classList.add(lang);
                            gageBarEl.style.transition = `all .5s ${delay * 0.35}s`;
                            gageBarEl.style.width = 0;

                            setTimeout(() => {
                              languageEl.style.opacity = 1;
                              languageEl.style.transform = 'translateY(0)';

                              liEl.style.width = Math.round(languageKeys[key] / totalLanguage * 100) + '%';
                              gageBarEl.style.width = 100 + '%';
                            }, 100);

                            liEl.appendChild(languageEl);
                            liEl.appendChild(gageBarEl);
                            languageAreaEl.appendChild(liEl);
                          }
                        }
                      }
                    }
                  });
                }
              }
            } else {
              alert(err);
            }
          });
        }
      }
    });
  })
  .catch((err) => {
    alert('없는 유저');
    lodingWrap.style.display = 'none';
    getUserIdWrap.style.display = 'block';
    resumeWrap.style.display = 'none';
  })
});
