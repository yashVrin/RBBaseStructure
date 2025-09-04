if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/trushal/.gradle/caches/8.12/transforms/a839f431f845038e1bad01a48e13d569/transformed/hermes-android-0.78.0-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/trushal/.gradle/caches/8.12/transforms/a839f431f845038e1bad01a48e13d569/transformed/hermes-android-0.78.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

