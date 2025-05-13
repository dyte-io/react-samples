# for dir in samples/*; do (cd "$dir" && npx ../../../dyte-to-rtk-codemod-new); done
for dir in samples/*; do (cd "$dir" && npm run build); done
