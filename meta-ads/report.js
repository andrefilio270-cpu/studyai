const fs = require('fs');
const path = require('path');

async function generateReport(results) {
  const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const br = results.brasil;
  const us = results.usa;

  function copiesTable(copies) {
    if (!copies) return '';
    return copies.map((c, i) => `
### Variação ${i + 1}
- **Título:** ${c.headline}
- **Texto principal:** ${c.primary_text}
- **Descrição:** ${c.description}
- **CTA:** ${c.cta}
`).join('');
  }

  const content = `# Campanhas StudyAI — Criadas em ${date}

## ✅ Status: Campanhas e Ad Sets criados com sucesso

---

## 🇧🇷 BRASIL

### Middle School Brasil
- **Campaign ID:** \`${br.middle_school?.campaignId || 'ERRO'}\`
- **Ad Set ID:** \`${br.middle_school?.adSetId || 'ERRO'}\`
- **Público:** 13–17 anos | Brasil
- **Orçamento:** R$ 15,00/dia
${copiesTable(br.middle_school?.copies)}

### High School Brasil
- **Campaign ID:** \`${br.high_school?.campaignId || 'ERRO'}\`
- **Ad Set ID:** \`${br.high_school?.adSetId || 'ERRO'}\`
- **Público:** 18–20 anos | Brasil
- **Orçamento:** R$ 20,00/dia
${copiesTable(br.high_school?.copies)}

### College Brasil
- **Campaign ID:** \`${br.college?.campaignId || 'ERRO'}\`
- **Ad Set ID:** \`${br.college?.adSetId || 'ERRO'}\`
- **Público:** 18–25 anos | Brasil
- **Orçamento:** R$ 25,00/dia
${copiesTable(br.college?.copies)}

---

## 🇺🇸 EUA

### Middle School USA
- **Campaign ID:** \`${us.middle_school?.campaignId || 'ERRO'}\`
- **Ad Set ID:** \`${us.middle_school?.adSetId || 'ERRO'}\`
- **Público:** 13–17 anos | EUA
- **Orçamento:** US$ 10,00/dia
${copiesTable(us.middle_school?.copies)}

### High School USA
- **Campaign ID:** \`${us.high_school?.campaignId || 'ERRO'}\`
- **Ad Set ID:** \`${us.high_school?.adSetId || 'ERRO'}\`
- **Público:** 18–20 anos | EUA
- **Orçamento:** US$ 15,00/dia
${copiesTable(us.high_school?.copies)}

### College USA
- **Campaign ID:** \`${us.college?.campaignId || 'ERRO'}\`
- **Ad Set ID:** \`${us.college?.adSetId || 'ERRO'}\`
- **Público:** 18–24 anos | EUA
- **Orçamento:** US$ 20,00/dia
${copiesTable(us.college?.copies)}

---

## 🚀 Como adicionar os criativos (imagens + texto)

1. Acesse **[business.facebook.com](https://business.facebook.com)** → Gerenciador de Anúncios
2. Encontre as campanhas **StudyAI** (status: Pausado)
3. Para cada campanha, clique em **"+ Criar anúncio"**
4. Cole os textos acima (título, texto principal, descrição)
5. Adicione uma imagem (veja IMAGENS.md)
6. URL de destino: \`https://loyal-fulfillment-production-4114.up.railway.app\`
7. Salve e **ative** quando estiver pronto

## 💡 Dica: Adicione 4 anúncios por campanha (um por variação de texto)
O Meta vai distribuir automaticamente e mostrar mais o que performar melhor.
`;

  fs.writeFileSync(path.join(__dirname, 'RESULTADO.md'), content, 'utf8');
  console.log(`\n📄 Relatório completo salvo em: meta-ads/RESULTADO.md`);
}

module.exports = { generateReport };
