import 'package:json_annotation/json_annotation.dart';

part 'product_model.g.dart';

@JsonSerializable()
class ProductModel {
  final String id;
  final String title;
  final String? description;
  final String? brand;
  final double price;
  @JsonKey(name: 'original_price')
  final double? originalPrice;
  final String currency;
  @JsonKey(name: 'category_path')
  final String categoryPath;
  @JsonKey(name: 'primary_category')
  final String primaryCategory;
  @JsonKey(name: 'image_urls')
  final List<String>? imageUrls;
  @JsonKey(name: 'primary_image_url')
  final String? primaryImageUrl;
  @JsonKey(name: 'product_url')
  final String productUrl;
  @JsonKey(name: 'affiliate_url')
  final String? affiliateUrl;
  @JsonKey(name: 'average_rating')
  final double? averageRating;
  @JsonKey(name: 'review_count')
  final int reviewCount;
  final Map<String, dynamic>? attributes;
  @JsonKey(name: 'availability_status')
  final String availabilityStatus;
  @JsonKey(name: 'is_on_sale')
  final bool isOnSale;
  @JsonKey(name: 'discount_percentage')
  final double discountPercentage;
  @JsonKey(name: 'popularity_score')
  final double? popularityScore;

  ProductModel({
    required this.id,
    required this.title,
    this.description,
    this.brand,
    required this.price,
    this.originalPrice,
    required this.currency,
    required this.categoryPath,
    required this.primaryCategory,
    this.imageUrls,
    this.primaryImageUrl,
    required this.productUrl,
    this.affiliateUrl,
    this.averageRating,
    required this.reviewCount,
    this.attributes,
    required this.availabilityStatus,
    required this.isOnSale,
    required this.discountPercentage,
    this.popularityScore,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) => _$ProductModelFromJson(json);
  Map<String, dynamic> toJson() => _$ProductModelToJson(this);

  // Helper getters
  String get displayPrice => '\$${price.toStringAsFixed(2)}';
  
  String? get displayOriginalPrice => 
      originalPrice != null ? '\$${originalPrice!.toStringAsFixed(2)}' : null;
  
  List<String> get tags => attributes?['tags']?.cast<String>() ?? [];
  
  String get mainImageUrl => 
      primaryImageUrl ?? 
      (imageUrls?.isNotEmpty == true ? imageUrls!.first : '');
}

@JsonSerializable()
class CategoryModel {
  final String id;
  final String name;
  final String slug;
  final String? description;
  @JsonKey(name: 'parent_id')
  final String? parentId;
  final int level;
  @JsonKey(name: 'icon_url')
  final String? iconUrl;
  @JsonKey(name: 'color_hex')
  final String? colorHex;
  @JsonKey(name: 'popularity_score')
  final double? popularityScore;

  CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.parentId,
    required this.level,
    this.iconUrl,
    this.colorHex,
    this.popularityScore,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) => _$CategoryModelFromJson(json);
  Map<String, dynamic> toJson() => _$CategoryModelToJson(this);
}

@JsonSerializable()
class BrandModel {
  final String id;
  final String name;
  final String slug;
  final String? description;
  @JsonKey(name: 'logo_url')
  final String? logoUrl;
  @JsonKey(name: 'website_url')
  final String? websiteUrl;
  @JsonKey(name: 'product_count')
  final int productCount;
  @JsonKey(name: 'popularity_score')
  final double? popularityScore;
  @JsonKey(name: 'is_featured')
  final bool isFeatured;

  BrandModel({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.logoUrl,
    this.websiteUrl,
    required this.productCount,
    this.popularityScore,
    required this.isFeatured,
  });

  factory BrandModel.fromJson(Map<String, dynamic> json) => _$BrandModelFromJson(json);
  Map<String, dynamic> toJson() => _$BrandModelToJson(this);
}