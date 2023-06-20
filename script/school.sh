# npm run seed 20230611153733-init-classes.js && \
curl 'http://localhost:3000/api/v1/sync/course' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: vi,vi-VN;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: nft-auth-session=Fe26.2*1*54fc82e5a3a9de53cca50e504970f1013619dcb57a8d99209fe21e18f3e6ad8f*_qEY4Tt-JlFqTqtxGhAVMA*L8ciLosLx8EqV4qxorBPL7_ikxaUpY2fSveAOpThm3gUl7fYdvDE5Tq9wVoYif_pec8ET5m5XNtZGWQuVntFXviWxeVTF60CgrH7qhme5525PQ0Q1oWsxODmLZzBGwAjjCeLU9zJERfL_4a5iTWADDpSgquEtcjupTCafW2Dbeh0tqBWiDH8W0yn0KBbb468tvKJi-IMgMlLJC7hFiW2h67i40UG6RSsoaD_Tuqs-15nzxqwbAS_xdnsYGcEkgrU-XrUD4u1RU5fUEksL5cZZmXYeHja_0Ebe0X7W7AN-PWnu_kK2aek91NvDVBgVfA9kVMKtw6DxWIQq35TZp8hVcf-lz0vWCj-HXdlQL2mg-IrJLTBv6Zyo_y9rZiG7T2jXmtzMg6APaDxb-XLis96cP09pG0_73Ys2OYVqyNfRmlnWC6eX_Je5iUfxjwq0h0Za-m-AazfgfCvufyCDzenJcpH6oej-najxam8s_tVCKHE7Ezb-txOYBxyGpyAPTVsT12rep_kDvwW2Wta2Gj3E_F4GjsXG-guJup96wwo0fU*1687968352630*d3867226adad24b7b78fa58576dd94eeb7c775b10edc5acb695855c64ef0985d*d6YnHrhrvV9HNUKQWcczUPimbzkbRuu1ikGsVthGNcU' \
  -H 'Origin: http://localhost:3000' \
  -H 'Pragma: no-cache' \
  -H 'Referer: http://localhost:3000/course' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw '{"signature":"0xbadc1c2a431cdd38f60c5187fc672bee4dcf06347367a59d63dd6b776d8435b82109f6b745fd6d9383fc59935b5fb59232e0b744b8cd229a5a6d34267a88626d1c","address":"0x98FB9BF010095517db4C66C358B0286ADB5100d6"}' \
  --compressed
# truffle exec ./contract-seeders/1686497720-contract-init-school.js